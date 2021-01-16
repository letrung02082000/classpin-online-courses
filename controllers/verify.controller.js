const studentModel = require('../models/student.model');
const nodemailer = require('nodemailer');
const { email } = require('../config/main.config');


function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = {
  verifyEmail: async function(req, res) {
    const userID = req.query.clientId;
    const key = req.query.key;
    const matchedUser = await studentModel.findById(userID);
    
    if(matchedUser) {
      if(matchedUser.verify_key === key) {
        // verified
        const filter = {_id: userID};
        let update;
        if(matchedUser.newEmail) {
          update = {verify: true, email: matchedUser.newEmail, newEmail: ""};
        } else{
          update = {verify: true};
        }
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
  },

  postResendEmail: async function(req, res) {
    const userEmail = req.body.email;
    const userID = req.body.userID;

    //check email already existed
    const anotherUser = await studentModel.findOne({email: userEmail, verify: true});
    if(anotherUser && anotherUser.verify === true) {
      res.render('verify', {
        title: "Failure",
        subject: "Verification",
        description: "this email is being used, please create another account with new email!",
      })
      return;
    }
    // end check


    const verify_key = makeid(50);
    const filter = {_id: userID};
    const update = {verify_key : verify_key};
    const createdStudent = await studentModel.findOneAndUpdate(filter, update);

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
          user: email.account, // generated ethereal user
          pass: email.password, // generated ethereal password
      },
      tls: {
          rejectUnauthorized: false,
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"ClassPin" <foo@example.com>', // sender address
      to: userEmail, // list of receivers
      subject: 'Verify your email', // Subject line
      text: '', // plain text body
      html: `<b>Click this link to verify your email! </b><a href="http://localhost:3000/verify/?clientId=${createdStudent._id}&key=${verify_key}">verify</a>`, // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    res.redirect('/account/login');
  },

  
}