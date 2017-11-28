if(!require(shiny)){install.packages("shiny"); require(shiny)}
if(!require(shinythemes)){install.packages("shinythemes"); require(shinythemes)}

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
