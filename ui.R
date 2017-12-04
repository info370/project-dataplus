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
                   tabPanel('Presentation Data',
                            h3('Our findings', align = "center"),
                            plotOutput('svm2'),
                            selectInput('predVariableSVM2', 
                                        label="Preditive Variable", 
                                        choices =  c("Census IncomePerCapita" = "censusIncomePerCapita",
                                                     "Census Gini Index of Inequality" = "censusGiniIndexOfInequality", 
                                                     "Review Count" = "reviewCount")),
                            h3('Connecting Analysis', align = "center"),
                            p("Connecting analysis decision"),
                            hr(),
                            h3('Limitations', align = "center"),
                            p("Limitations, future work"),
                            p("Write analysis here on data")
                   )
))
