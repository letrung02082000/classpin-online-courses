module.exports = {
  port: process.env.PORT || 3000,
  mongo_url : process.env.MONGO_URL || 'mongodb://localhost:27017/OnlineCourses',
  env: process.env.NODE_ENV || 'development',
  secret_session: process.env.SECRET_SESSION || '2421321ddad12431rqdasdasdfa',
  google : {
    clientID : process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  },
  facebook: {
    clientID : process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
  },
  twitter: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  },
  linkedin: {
    clientID: process.env.LINKEDIN_KEY,
    clientSecret: process.env.LINKEDIN_SECRET,
  },
  email: {
    account: process.env.EMAIL_ACCOUNT,
    password: process.env.EMAIL_PASS,
  }
}