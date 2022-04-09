//dependencies
var express = require('express');
var router = express.Router();
const newUserModel = require('../../model/usersModel');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const rolesModel = require('../../model/rolesModel');
router.post('/login/adminLogin', function (req, res) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).send("arguments missing");
    }
    else {
        try {
            newUserModel.findOne({ $and: [{ isActive: true }, { Username: req.body.username }, { RowStatus: 0 }] }, (err, response) => {
                if (response == null) {
                    return res.send({ status: false, message: "Invalid UserName" });
                } else {
                    rolesModel.findOne({ $and: [{ RoleID: response.RoleID }, { RowStatus: 0 }] }, function (errrr, respo) {
                        if (respo == null) {
                            return res.send({ status: false, message: "The User Does Not Have Rights" });
                        } else {
                            newUserModel.findOne({ _id: response._id }, (err, results) => {
                                if (err) {
                                    res.send(err)
                                } else {
                                    rolesModel.findOne({ RoleID: response.RoleID }, (err, role) => {
                                        if (err) {
                                            res.send(err)
                                        } else {
                                            const result = bcrypt.compareSync(req.body.password, response.Password);
                                            if (result) {
                                                const userObject = response.toObject();
                                                delete userObject.Password;
                                                const expiry = Math.floor((Date.now() + (24 * 60 * 60 * 1000)) / 1000);
                                                const token = jwt.sign({
                                                    userObject,
                                                    exp: expiry
                                                }, "secret_for_now");
                                                const refToken = jwt.sign({
                                                    userObject,
                                                    exp: expiry
                                                }, "some_other_secret");
                                                res.status(200).send({
                                                    status: true,
                                                    token: token,
                                                    refToken: refToken,
                                                    Admin: response,
                                                    roleData: role
                                                });
                                            } else {
                                                return res.send({ status: false, message: "Incorrect Password" });
                                            }
                                        }
                                    });
                                }
                            })
                        }
                    })
                }
            });
        }
        catch (error) {
            res.status(400).send(error);
        }
    }
});



module.exports = router;