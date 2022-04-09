var express = require('express');
var router = express.Router();
var newUserModel = require('../../model/usersModel')
const nodemailer = require('nodemailer');
const tnewUserModel = require('../../model/usersModel');
const bcrypt_1 = require("bcrypt");


router.post('/verifyUser', (req, res) => {
    var data = req.body;
    newUserModel.find({ Username: data.username }, function (err, resp) {
        if (resp.length != 0) {
            sendEmail(resp, function (err, resultemail) {
                if (resultemail.status == true) {
                    var saveObject = {}
                    saveObject.username = req.body.username;
                    saveObject.newpassword = req.body.newpassword;
                    saveObject.confirmpassword = req.body.confirmpassword;
                    saveObject.OTP = Number(resultemail.data);
                    saveObject.userID = resp[0].NewUserID;
                    var otpDetails = new otpModel(saveObject);
                    otpDetails.save(function (err, responsee) {
                        if (err) {
                            res.send(err)
                        } else {
                            res.send({ status: true, data: responsee });
                        }
                    })
                }
            })
        } else {
            res.send({ status: false, message: "The User Does Not Exists" });
        }
    })
})
function sendEmail(resp, cb) {
    console.log("ffffffff", resp)
    let transporter = nodemailer.createTransport({
        host: 'mail.dealmoney.in',
        port: 465,
        secure: true,
        tls: {
            rejectUnauthorized: false
        },
        auth: {
            user: 'supreme@familycarehospitals.com',
            pass: 'Sup@Fam0'
        }
    });

    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    console.log(OTP)
    let mailOptions = {

        from: 'no-reply@familycarehospitals.com', // sender address
        to: resp[0].Email, // list of receivers
        subject: "Hello", // Subject line
        text: "<b>Hello world?</b>",
        html: "Your OTP for verification is " + OTP,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            cb(error, null)
        } else {
            console.log('Message %s sent: %s', info.messageId, info.response);
            cb(null, { status: true, data: OTP })
        }
    });
}



router.get('/getotpDetails/:id', function (req, res) {
    otpModel.findOne({ _id: req.params.id }, function (err, resp) {
        if (err) {
            res.send(err)
        } else {
            // console.log("ggggggggggg", resp)
            res.send(resp)

        }
    });
});


router.post('/update', function (req, res) {
    // console.log(".......", req.body)
    tnewUserModel.update({ NewUserID: req.body.userID }, {
        $set: {
            Password: createPassword(req.body.newpassword),
        }
    }, function (err, resp) {

        if (err) {
            res.send({ status: false, msg: "Error" })
        } else {
            // console.log("...........", resp)
            res.send({ status: true, msg: "Password Updated Successfully" })

        }
    });
})

function createPassword(password) {
    return bcrypt_1.hashSync(password, bcrypt_1.genSaltSync(9));
}

module.exports = router;



