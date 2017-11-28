library(dplyr)
library(rsconnect)
library(shiny)
library(ggplot2)


seattle.census <- read.csv('./Seattle_Census_Tract_Data.csv', stringsAsFactors = FALSE)
# source("./scripts/DiagnosisWillingness.R")

shinyServer(function(input, output) { 
  # http://rstudio.github.io/shiny/tutorial/#hello-shiny
  output$examplePlot <- renderPlot({
    # Do work in here and create a plot to use it in the ui.R file.
    # only use one plot and that will be used in this function.
    data <- mtcars
    plot(mtcars$mpg, mtcars$cyl)
  })
})
