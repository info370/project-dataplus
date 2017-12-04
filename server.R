if(!require(dplyr)){install.packages("dplyr"); require(dplyr)}
if(!require(rsconnect)){install.packages("rsconnect"); require(rsconnect)}
if(!require(shiny)){install.packages("shiny"); require(shiny)}
if(!require(ggplot2)){install.packages("ggplot2"); require(ggplot2)}
if(!require(jsonlite)){install.packages("jsonlite"); require(jsonlite)}
if(!require(plyr)){install.packages("plyr"); require(plyr)}
if(!require(mlbench)){install.packages("mlbench"); require(mlbench)}
if(!require(ModelMetrics)){install.packages("ModelMetrics"); require(ModelMetrics)}
if(!require(RcppRoll)){install.packages("RcppRoll"); require(RcppRoll)}
if(!require(recipes)){install.packages("recipes"); require(recipes)}
if(!require(DEoptimR)){install.packages("DEoptimR"); require(DEoptimR)}
if(!require(caret)){install.packages("caret", dependencies = c("Depends", "Suggests")); require(caret)}
if(!require(jsonlite)){install.packages("jsonlite"); require(jsonlite)}
if(!require(cellranger)){install.packages("cellranger"); require(cellranger)}
if(!require(tidyverse)){install.packages("tidyverse"); library(tidyverse)} 
if(!require(modelr)){install.packages("modelr"); library(modelr)} 

seattle.census <- read.csv('./Seattle_Census_Tract_Data.csv', stringsAsFactors = FALSE)
json_file <- 'SeattleYelpRestaurants.json'
yelp.data <- fromJSON(json_file) #%>% filter(!is.na(price)) %>% filter(!is.na(reviewCount)) %>% filter(!is.na(censusMedianHHIncome)) %>% filter(!is.na(censusIncomePerCapita)) %>% filter(!is.na(censusGiniIndexOfInequality)) 

filtered.yelp <- subset(yelp.data, select=c("reviewCount", "censusMedianHHIncome", "censusIncomePerCapita", "censusGiniIndexOfInequality"))
price.num <- c(nchar(yelp.data[,"price"]))
filtered.yelp$price = price.num

filtered.yelp$rating = yelp.data[,"rating"]

split_proportion = 0.8

# select outcome variable
outcome <- filtered.yelp %>% dplyr::select(rating)

# randomly select indices for train/validate set
train_ind <- createDataPartition(outcome$rating, p = split_proportion, list = FALSE)
filtered_yelp_train <- na.omit(filtered.yelp[train_ind,]) # get training data
filtered_yelp_test <- na.omit(filtered.yelp[-train_ind,]) # get test data

yelp_test_x <- na.omit(filtered.yelp) %>% dplyr::select(-rating) # select predictor data for test set
yelp_test_y <- na.omit(filtered.yelp) %>% dplyr::select(rating) # select outcome data for test set

ctrl <- trainControl(method = "repeatedcv", number=10, repeats=3)

filtered.yelp.w.ratings <- filtered.yelp
no.na.rating <- yelp.data[,"rating"]
no.na.rating[!is.na(no.na.rating)]
filtered.yelp.w.ratings$rating <- no.na.rating

set.seed(370)

shinyServer(function(input, output) { 
  # http://rstudio.github.io/shiny/tutorial/#hello-shiny
  output$examplePlot <- renderPlot({
    # Do work in here and create a plot to use it in the ui.R file.
    # only use one plot and that will be used in this function.
    data <- mtcars
    plot(mtcars$mpg, mtcars$cyl)
  })
  
  # Correlation Matrix print colnames
  output$corr <- renderText({
    corr_matrix <- cor(filtered.yelp)
    
    cutoff <- 0.2
    
    highly_corr <- findCorrelation(corr_matrix, cutoff=cutoff)
    return(print(colnames(filtered.yelp)[highly_corr]))
  })
  
  # Importance plot
  output$importance <- renderPlot({
    model <- train(rating ~., data=na.omit(filtered.yelp.w.ratings), method = "knn", preProcess = "scale", trControl = ctrl)
    
    importance <- varImp(model)
    return(ggplot(importance))
  })
  
  # rfeControl plot
  output$rfeControl <- renderPlot({
    control <- rfeControl(functions = rfFuncs, method="cv", number=10)
    omit <- na.omit(filtered.yelp.w.ratings)
    results <- rfe(omit[,1:5], omit[,6], sizes = c(1:5), rfeControl = control)
    return(ggplot(results))
  })
  
  output$regression <- renderPlot({
    model_lm <- train(rating ~ ., # outcome is "medv", all other columns are predictors
                      data = filtered_yelp_train, # training data
                      method = "lm", # model type (linear model)
                      trControl=ctrl) # evaluation method
    
    # coefficients
    model_lm$finalModel
    
    # getting performance on test set (as root mean squared error (L2 norm), R^2, mean absolute error (L1 norm))
    predict_yelp_lm <- predict(model_lm, yelp_test_x)
    postResample(predict_yelp_lm, yelp_test_y$rating)
    
    # creating grid of data to plot results for test set
    grid <- filtered_yelp_test %>%
      gather_predictions(model_lm)
    
    # getting important variales
    varImp(model_lm)
    
    return(ggplot(filtered_yelp_test, aes(as.factor(rating), input$predVariableReg)) +
      geom_violin() + 
      stat_summary(fun.y=mean, geom="point", shape=23, size=2, color="blue") + 
      stat_summary(fun.y=median, geom="point", size=2, color="red") + 
      geom_boxplot(width=0.1))
  })
  
  output$svm <- renderPlot({
    model_svm <- train(rating ~ .,
                       data = na.omit(filtered_yelp_train),
                       method = "svmRadial",
                       trControl=ctrl,   # Radial kernel
                       tuneLength = 10)

    # getting performance on test set (as root mean squared error (L2 norm), R^2, mean absolute error (L1 norm))
    predict_yelp_svm <- predict(model_svm, yelp_test_x)
    postResample(predict_yelp_svm, yelp_test_y$rating)
    
    # creating grid of data to plot results
    grid <- filtered_yelp_test %>%
      gather_predictions(model_svm)
    
    varImp(model_svm) # getting most important variables
    
    return(ggplot(filtered_yelp_test, aes(as.factor(rating), input$predVariableSVM)) +
      geom_violin() + 
      stat_summary(fun.y=mean, geom="point", shape=23, size=2, color="blue") + 
      stat_summary(fun.y=median, geom="point", size=2, color="red") + 
      geom_boxplot(width=0.1))
  })
  
  output$spline <- renderPlot({
    model_spline <- train(rating ~ ., # outcome is "medv", predictors=all other columns
                          data = na.omit(filtered_yelp_train),  # training data
                          trControl=ctrl, # evaluation method
                          method = "gamSpline", # model: generalized addive model using splines
                          tuneLength = 30) # number of parameters to try
    
    # getting performance on test set (as root mean squared error (L2 norm), R^2, mean absolute error (L1 norm))
    predict_yelp_spline <- predict(model_spline, yelp_test_x)
    postResample(predict_yelp_spline, yelp_test_y$rating)
    
    # creating grid of data to plot results
    grid <- filtered_yelp_test %>%
      gather_predictions(model_spline)
    
    varImp(model_spline) # getting most important variables
    
    ggplot(filtered_yelp_test, aes(as.factor(rating), input$predVariableSpline)) +
      geom_violin() + 
      stat_summary(fun.y=mean, geom="point", shape=23, size=2, color="blue") + 
      stat_summary(fun.y=median, geom="point", size=2, color="red") + 
      geom_boxplot(width=0.1)
  })
})
