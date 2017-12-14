# [Final Artifact Link](https://info370.github.io/project-dataplus/)
Click [here](https://info370.github.io/project-dataplus/) for our final artifact.

## Libraries included in rmd
```
1. dplyr - filtering, selecting, and manipulating dataframes
2. jsonlite - ability to create read json files
3. ggplot2 - to plot graphs
4. tidyverse - includes ggplot2 and dplyr
5. modelr - loads google maps
6. ggmap - package to plot map for ggplots
7. caret - feature selection and modeling
8. ModelMetrics - caret's dependencies
9. recipes - caret's dependencies
10. DEoptimR - caret's dependencies
```

## Conclusion
From our analysis of 1852 restaurants, we matched each restaurants’ location to its census tract to find out the median household income within the restaurant’s location. From there, we split the data to low, mid, and high socioeconomic status (SES). Based on the regression model training with our data, the predictive model of high SES areas doesn’t create an overestimation or underestimation of the actual data while the predictive model of low SES areas underestimated the actual data. These results indicate that in low SES areas, approximately 63% of the Yelp ratings create an underestimation of the actual rating of restaurants in those areas and an approximately 37% of overestimation. The difference in proportion is not a substantial enough to consider the result as significant. Therefore, we cannot reject our null hypothesis that restaurant’s ratings have biased based on socioeconomic status because our overestimation and underestimation numbers do not have a significant difference.

The analysis may not provide a conclusive evidence that there is biased in restaurants rating based on socioeconomic status, however, it provides a foundation to future research on restaurants rating. There is an array of factors that contribute to a restaurant’s quality such as location proximately, food freshness, taste, and many more that we have not included in the analysis. In addition, there are also other information that we can pull from the City of Seattle such as crime rate/index in neighborhoods, median house rental price, number of individual household members, average age of a neighbourhood, and more. In future research, we hope to include those additional factors and features to enhance our regression model and findings.
