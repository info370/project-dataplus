if(!require(dplyr)){install.packages("dplyr"); require(dplyr)}
if(!require(rsconnect)){install.packages("rsconnect"); require(rsconnect)}
if(!require(shiny)){install.packages("shiny"); require(shiny)}
if(!require(ggplot2)){install.packages("ggplot2"); require(ggplot2)}
if(!require(jsonlite)){install.packages("jsonlite"); require(jsonlite)}
if(!require(plyr)){install.packages("plyr"); require(plyr)}

seattle.census <- read.csv('./Seattle_Census_Tract_Data.csv', stringsAsFactors = FALSE)
json_file <- "SeattleYelpRestaurants.json"
yelp.data <- fromJSON(json_file)

shinyServer(function(input, output) { 
  # http://rstudio.github.io/shiny/tutorial/#hello-shiny
  output$examplePlot <- renderPlot({
    # Do work in here and create a plot to use it in the ui.R file.
    # only use one plot and that will be used in this function.
    data <- mtcars
    plot(mtcars$mpg, mtcars$cyl)
  })
})
