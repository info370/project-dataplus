if(!require(shiny)){install.packages("shiny"); require(shiny)}
if(!require(shinythemes)){install.packages("shinythemes"); require(shinythemes)}

shinyUI(navbarPage('Final Project 370',
                   theme = shinytheme("superhero"),
                   tabPanel('Introduction',
                            h3("Introduction", align = "center"),
                            p("Write introduction here"),
                            hr(),
                            h3("Decision Context", align = "center"),
                            p("This is where our decision context will go."),
                            hr(),
                            h3("Method", align = "center"),
                            p("This is where our method will go."),
                            hr()
                   ),
                   tabPanel('Data',
                            h3('Data', align = "center"),
                            plotOutput("examplePlot"),
                            p("Write analysis here on data")
                   ),
                   tabPanel('Results',
                            h3('Results', align = "center"),
                            p("To first get the results, we ran a feature selection in order to determine
                              the best preditive values. From the data we were able to gather, there were
                              only a few selected values that were measureable and not descriptive. We ran
                              a correlation matrix and saw that the following have high correlation to our
                              outcome value, Yelp's ratings."),
                            p("We also used a training model to rank the importance of the features
                              we selected"),
                            plotOutput('importance'),
                            p("Contining on, we wanted to see if there was a different running another
                              feature selection model to ensure the best use of the preditive values
                              we had chosen"),
                            plotOutput("rfeControl"),
                            hr(),
                            p("Using the same pred variables, we continue by training the data into a regression
                              model and getting the following results"),
                            plotOutput('Regression'),
                            selectInput('predVariableReg', 
                                        label="Preditive Variable", 
                                        choices =  c("Census IncomePerCapita" = "censusIncomePerCapita",
                                                     "Census Gini Index of Inequality" = "censusGiniIndexOfInequality", 
                                                     "Review Count" = "reviewCount", 
                                                     "Census Median Household Income" = "censusMedianHHIncome", 
                                                     "Price" = "price")),
                            
                            p("Using the same pred variables, we continue by training the data into a SVM
                              model and getting the following results"),
                            plotOutput('svm'),
                            selectInput('predVariableSVM', 
                                        label="Preditive Variable", 
                                        choices =  c("Census IncomePerCapita" = "censusIncomePerCapita",
                                                     "Census Gini Index of Inequality" = "censusGiniIndexOfInequality", 
                                                     "Review Count" = "reviewCount", 
                                                     "Census Median Household Income" = "censusMedianHHIncome", 
                                                     "Price" = "price")),
                            
                            p("Using the same pred variables, we continue by training the data into a spline
                              model and getting the following results"),
                            plotOutput("spline"),
                            selectInput('predVariableSpline', 
                                        label="Preditive Variable", 
                                        choices =  c("Census IncomePerCapita" = "censusIncomePerCapita",
                                                     "Census Gini Index of Inequality" = "censusGiniIndexOfInequality", 
                                                     "Review Count" = "reviewCount", 
                                                     "Census Median Household Income" = "censusMedianHHIncome", 
                                                     "Price" = "price")),
                            h3('Connecting Analysis', align = "center"),
                            p("Connecting analysis decision"),
                            hr(),
                            h3('Limitations', align = "center"),
                            p("Limitations, future work")
                   )
))
