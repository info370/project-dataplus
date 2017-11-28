library(shiny)
library(shinythemes)

shinyUI(navbarPage('Final Project 370',
                   theme = shinytheme("superhero"),
                   tabPanel('Introduction',
                            h3("Introduction", align = "center"),
                            p("Write introduction here"),
                            hr()
                   ),
                   tabPanel('Linear Regression',
                            
                            h3('Title here', align = "center"),
                            plotOutput("examplePlot"),
                            p("Write analysis here on linear regression")
                   )
))
