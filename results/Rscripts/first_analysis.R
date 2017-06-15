# First analysis of Perception of Prosody I
# created by gratton on 3rd June 2017

setwd("/Users/Chantal/Documents/Doctoral/Courses/Spring 2017/LIN 245/perception/data/")
library(languageR)
library(lme4)
library(tidyverse)
library(ggplot2)

df = read.csv("complete_trials_reduced.csv")
head(df)
summary(df)
nrow(df)
summary(df$topic)

# Subset with only critical trials
crit_df <- df[df$filler == "False",]
head(crit_df)
summary(crit_df)
nrow(crit_df)

# Re-factor data to remove empty labels
unique(crit_df$topic)
crit_df$topic <- factor(crit_df$topic)
unique(crit_df$topic)
crit_df$prosody <- factor(crit_df$prosody)
unique(crit_df$prosody)
summary(crit_df$topic)

# Number of trails for each topic/valence combination
table(crit_df$topic, crit_df$prosody)

# Number of trials for each valence/adjective valence combination
table(crit_df$prosody, crit_df$adj_1_pole)


# ------------------ EXPLORING AGREEMENT ------------------
## Distribution
table(crit_df$agree)
summary(crit_df$agree)
table(crit_df$agree, crit_df$prosody)

mean(crit_df$agree[crit_df$prosody=="affirmative"])
mean(crit_df$agree[crit_df$prosody=="contrastive"])

ggplot(crit_df, aes(x=agree)) +
  geom_histogram(binwidth=.01) +
  xlab("Perceived agreement (%)") +
  ylab("Overall responses")

## Visualising the data
ggplot(crit_df, aes(x=prosody,y=agree,color=adj_1_pole)) +
  geom_point(size=.5) +
  labs(title = "XYZ", x = "Prosodic contour", y = "Percieved agreement (%)", color = "Adjective polarity")

ggplot(crit_df, aes(x=prosody,y=agree)) +
  geom_violin() +
  geom_boxplot(alpha=.4,notch=T) +
  labs(title = "XYZ", x = "Prosodic contour", y = "Percieved agreement (%)", color = "Adjective polarity")

ggplot(crit_df, aes(x=prosody,y=agree,color=adj_1)) +
  geom_violin() +
  geom_boxplot(alpha=.4,notch=T) +
  labs(title = "XYZ", x = "Prosodic contour", y = "Percieved agreement (%)", color = "Adjective polarity")
  #geom_point(data=agr,aes(y=MeanRT),color="orange",size=10)

ggsave(file="../graphs/agree_violin.png",width=5,height=5)

# agreement by prosody and worker
ggplot(crit_df, aes(x=as.factor(workerid),y=agree,color=adj_1_pole)) +
  geom_boxplot(alpha=.4) +
  labs(title = "XYZ", x = "Prosodic contour", y = "Percieved agreement (%)", color = "Adjective polarity")

## Agreement models
m1_agree = lm(agree ~ prosody, data=crit_df, REML=F)
summary(m1_agree) ## prosodycontrastive Est = 0.02

m2_agree = lm(agree ~ prosody + adj_1_pole, data=crit_df)
summary(m2_agree)

m3_agree = lm(agree ~ prosody*adj_1_pole, data=crit_df)
summary(m3_agree)

m4_agree = lm(agree ~ prosody:adj_1_pole, data=crit_df)
summary(m4_agree)


# ------------------ EXPLORING EVALUATION ------------------ 
## Distribution
table(crit_df$like)
summary(crit_df$like)

mean(crit_df$like[crit_df$prosody=="affirmative"])
mean(crit_df$like[crit_df$prosody=="contrastive"])

ggplot(crit_df, aes(x=like)) +
  geom_histogram(binwidth=.01) +
  xlab("Perceived evaluation (%)") +
  ylab("Overall responses")

## Visualising the data
ggplot(crit_df, aes(x=prosody,y=like,color=adj_1_pole)) +
  geom_point(size=.5) +
  labs(title = "XYZ", x = "Prosodic contour", y = "Percieved evaluation (%)", color = "Adjective polarity")

ggplot(crit_df, aes(x=prosody,y=like)) +
  geom_violin() +
  geom_boxplot(alpha=.4,notch=T) +
  labs(title = "XYZ", x = "Prosodic contour", y = "Percieved evaluation (%)", color = "Adjective polarity")

ggplot(crit_df, aes(x=prosody,y=like,color=adj_1_pole)) +
  geom_violin() +
  geom_boxplot(alpha=.4,notch=T) +
  labs(title = "XYZ", x = "Prosodic contour", y = "Percieved evaluation (%)", color = "Adjective polarity")
#geom_point(data=agr,aes(y=MeanRT),color="orange",size=10)

## Simple model
m2_like = lm(like ~ prosody, data=crit_df, REML=F)
summary(m2_like) ## prosodycontrastive Est = -0.08

m2_like = lm(like ~ prosody + adj_1_pole, data=crit_df)
summary(m2_like)

m3_like = lm(like ~ prosody*adj_1_pole, data=crit_df)
summary(m3_like)



# ------------------ EXPLORING FRIENDLINESS ------------------
## Distribution
table(crit_df$friendly)
summary(crit_df$friendly)

mean(crit_df$friendly[crit_df$prosody=="affirmative"])
mean(crit_df$friendly[crit_df$prosody=="contrastive"])

ggplot(crit_df, aes(x=friendly)) +
  geom_histogram(binwidth=.01) +
  xlab("Perceived friendliness (%)") +
  ylab("Overall responses")

## Visualising the data
ggplot(crit_df, aes(x=prosody,y=friendly,color=adj_1_pole)) +
  geom_point(size=.5) +
  labs(title = "XYZ", x = "Prosodic contour", y = "Percieved friendliness (%)", color = "Adjective polarity")

ggplot(crit_df, aes(x=prosody,y=friendly,color=adj_1_pole)) +
  geom_violin() +
  geom_boxplot(alpha=.4,notch=T) +
  labs(title = "XYZ", x = "Prosodic contour", y = "Percieved friendliness (%)", color = "Adjective polarity")
#geom_point(data=agr,aes(y=MeanRT),color="orange",size=10)

## Simple model
m1_friendly = lm(friendly ~ prosody, data=crit_df, REML=F)
summary(m1_friendly) ## prosodycontrastive Est = -0.02

m2_friendly = lm(friendly ~ prosody + adj_1_pole, data=crit_df)
summary(m2_friendly)

m3_friendly = lm(friendly ~ prosody*adj_1_pole, data=crit_df)
summary(m3_friendly)


# ------------------ EXPLORING MOOD ------------------
## Distribution
table(crit_df$happy)
summary(crit_df$happy)

mean(crit_df$happy[crit_df$prosody=="affirmative"])
mean(crit_df$happy[crit_df$prosody=="contrastive"])

ggplot(crit_df, aes(x=happy)) +
  geom_histogram(binwidth=.01) +
  xlab("Perceived happiness (%)") +
  ylab("Overall responses")

## Visualising the data
ggplot(crit_df, aes(x=prosody,y=happy,color=adj_1_pole)) +
  geom_point(size=.5) +
  labs(title = "XYZ", x = "Prosodic contour", y = "Percieved happiness (%)", color = "Adjective polarity")

ggplot(crit_df, aes(x=prosody,y=happy,color=adj_1_pole)) +
  geom_violin() +
  geom_boxplot(alpha=.4,notch=T) +
  labs(title = "XYZ", x = "Prosodic contour", y = "Percieved happiness (%)", color = "Adjective polarity")
#geom_point(data=agr,aes(y=MeanRT),color="orange",size=10)

## Simple model
m1_happy = lm(happy ~ prosody, data=crit_df)
summary(m1_happy) ## prosodycontrastive Est = -0.12

m2_happy = lm(happy ~ prosody + adj_1_pole, data=crit_df)
summary(m2_happy)

m3_happy = lm(happy ~ prosody*adj_1_pole, data=crit_df)
summary(m3_happy)



summary(lm(agree ~ prosody*adj_1_pole + like + friendly + happy + as.factor(adj_1), data=crit_df, REML=F))






m1 = 
summary(lm(agree ~ prosody +adj_1_pole + prosody:adj_1_pole + as.factor(workerid), data=sans22))

m = lmer(agree ~ prosody*adj_1_pole +  (1|workerid), data=crit_df, REML=F)
summary(m)
cor(fitted(m),crit_df$agree)^2

summary(lmer(agree ~ prosody*adj_1_pole +  (1|workerid), data=crit_df, REML=F))
cor(fitted(lmer(agree ~ prosody*adj_1_pole +  (1|workerid), data=crit_df, REML=F)),crit_df$agree)^2

# interaction of prosody and adj_pole, with worker fixed effects
summary(lm(agree~as.factor(prosody)*as.factor(adj_1_pole) + as.factor(workerid),data=crit_df))


summary(lm(happy~as.factor(prosody)*as.factor(adj_1_pole) + as.factor(workerid),data=sans22))

library(lmerTest)
summary(lmer(happy ~ prosody*adj_1_pole + (1|workerid) + (1|adj_1),  ))





#### TARA NOTES

