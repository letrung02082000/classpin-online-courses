module.exports = {
  port: process.env.PORT || 3000,
  mongo_url : process.env.MONGO_URL || 'mongodb://localhost:27017/OnlineCourses',
  env: process.env.NODE_ENV || 'development',
  secret_session: process.env.SECRET_SESSION || '2421321ddad12431rqdasdasdfa'
}