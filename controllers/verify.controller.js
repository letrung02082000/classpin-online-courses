const studentModel = require('../models/student.model');

module.exports = {
  verifyEmail: async function(req, res) {
    const userID = req.query.clientId;
    const key = req.query.key;
    const matchedUser = await studentModel.findById(userID);
    if(matchedUser) {
      if(matchedUser.verify_key === key) {
        // verified
        const filter = {_id: userID};
        const update = {verify: true};
        await studentModel.findOneAndUpdate(filter, update);
        res.render('verify', {
          title: "Success",
          subject: "Verification",
          description: "email verification is successful!",
        })
        return;
      }
    }

    res.render('verify', {
      title: "Ooops",
      subject: "Verification",
      description: "Email verification failed!",
    })
  }
}