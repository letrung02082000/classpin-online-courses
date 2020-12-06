const mongoose = require('mongoose');

module.exports = {
  connectMongoDB(mongo_url) {
    mongoose.connect(mongo_url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err) {
      if(err) {
        console.error(err);
      } else {
        console.log(`Connected to mongo server`);
      }
    })
  }
}