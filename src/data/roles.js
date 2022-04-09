var express = require('express');
var router = express.Router();
const rolesModel = require('../../model/rolesModel');

router.post('/saveRole', function (req, res) {
    var data = req.body;
    rolesModel.find({ $and: [{ RoleName: data.RoleName }, { RowStatus: 0 }] }, function (err, response) {
        if (response.length > 0) {
            res.send({ status: false, msg: 'This Role Name Already Exist.' });
        } else {
            getRoleID(function (err, no) {
                var saveObject = {}
                if (no.length == 0) {
                    saveObject.RoleID = 1
                } else {
                    saveObject.RoleID = no[0].RoleID + 1
                }
                saveObject.RoleName = data.RoleName;
                saveObject.UserRolesRights = data.usersArray;
                saveObject.userLogRights = data.userlogArray;
                saveObject.CreationDate = new Date();
                var role = new rolesModel(saveObject)
                role.save((err, response) => {
                    if (err) {
                        res.send(err)
                    } else {
                        res.send({ status: true, msg: 'Role Added Successfully.' })
                    }
                });
            })
        }
    });
});

function getRoleID(cb) {
    rolesModel.find((err, response) => {
        if (err) {
            cb(err, null)
        } else {
            cb(null, response)
        }
    }).sort({ RoleID: -1 }).limit(1);
};

router.get('/getAllRoles', function (req, res) {
    rolesModel.find({ $and: [{ RowStatus: 0 }] }, function (err, resp) {
        if (err) {
            res.send(err)
        } else {
            res.send(resp)
        }
    });
});

router.get('/getRoleById/:id', function (req, res) {
    rolesModel.findOne({ _id: req.params.id }, function (err, resp) {
        if (err) {
            res.send(err)
        } else {
            res.send(resp)
        }
    });
});

router.get('/getRoleByRoleID/:id', function (req, res) {
    rolesModel.findOne({ RoleID: req.params.id }, function (err, resp) {
        if (err) {
            res.send(err)
        } else {
            res.send(resp)
        }
    });
});


router.post('/remove', function (req, res) {
    rolesModel.update({ _id: req.body.id }, { $set: { 'RowStatus': 1 } }, function (err, resp) {
        if (err) {
            res.send(err)
        } else {
            if (resp.n == 1) {
                res.send(resp)
            }
        }
    });
});

router.post('/searchRoles', function (req, res) {
    rolesModel.find({ $and: [{ RoleName: new RegExp(req.body.name, "i") }, { RowStatus: 0 }] }, function (err, response) {
        if (err) {
            res.send(err)
        } else {
            res.send(response)
        }
    });
});

router.post('/updateRole', (req, res) => {
    rolesModel.update({ _id: req.body.id },
        {
            $set: {
                'RoleName': req.body.RoleName,
                'UserRolesRights': req.body.usersArray,
                'userLogRights': req.body.userlogArray,
            }
        }, function (err, resp) {
            if (err) {
                res.send(err)
            } else {
                if (resp.n == 1) {
                    res.send(resp)
                }
            }
        });
});
module.exports = router;



