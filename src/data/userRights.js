var express = require('express');
var router = express.Router();
const bcrypt_1 = require("bcrypt");
const mongoose_1 = require("mongoose");
const rolesModel = require('../../model/rolesModel');
const usersModel = require('../../model/usersModel');
router.get('/getAllUserRights', (req, res) => {
  usersModel.find({ RowStatus: 0 }, function (err, resp) {
    if (err) {
      res.send(err)
    } else {
      res.send(resp)
    }
  });
});

router.post('/searchUserRights', (req, res) => {
  usersModel.find({ $and: [{ Username: new RegExp(req.body.name, "i") }, { isActive: true }, { RowStatus: 0 }] }, function (err, response) {
    if (err) {
      res.send(err)
    } else {
      res.send(response)
    }
  });
});


router.post('/saveUser', (req, res) => {
  var id
  usersModel.find({ $and: [{ Username: req.body.username }, { RowStatus: 0 }] }, function (err, response) {
    if (response.length > 0) {
      res.send({ status: false, msg: 'This User Name Already Exist.' });
    }
    else {
      getIncrementedNewUserID(function (err, no) {
        if (no.length == 0) {
          id = 1
        } else {
          id = no[0].NewUserID + 1
        }
        var saveNewUser = new usersModel({
          PrintUserName: req.body.PrintUserName,
          Email: req.body.email,
          NewUserID: id,
          Password: createPassword(req.body.password),
          RoleID: Number(req.body.Role),
          Username: req.body.username
        });
        saveNewUser.save(function (error, resp) {
          if (error) {
            res.send(error)
          } else {
            res.send({ status: true, msg: 'User Added Successfully.' })
          }
        })
      })
    }
  })
});

router.post('/remove', function (req, res) {
  usersModel.update({ _id: req.body.id }, { $set: { 'RowStatus': 1 } }, function (err, resp) {
    if (err) {
      res.send(err)
    } else {
      if (resp.n == 1) {
        res.send(resp)
      }
    }
  });
});

router.get('/details/:id', function (req, res) {
  usersModel.aggregate([
    { $match: { $and: [{ _id: mongoose_1.Types.ObjectId(req.params.id) }, { RowStatus: 0 }] } },
    {
      $lookup: {
        from: "dbo.newroles",
        localField: "RoleID",
        foreignField: "RoleID",
        as: "Role"
      },
    }
  ],
    function (err, response) {
      if (err) {
        res.send(err)
      } else {
        res.send(response)
      }
    });
});

router.post('/updateUser', (req, res) => {

  rolesModel.findOne({ $and: [{ RoleID: Number(req.body.Role) }, { RowStatus: 0 }] }, function (errrr, respo) {
    if (respo == null) {
      res.send({ status: false, msg: "Please Select Role" });
    } else {

      usersModel.update({ _id: req.body.id },
        {
          $set: {
            'PrintUserName': req.body.PrintUserName,
            'Email': req.body.email,
            'Username': req.body.username,
            'RoleID': Number(req.body.Role),
            'HospitalID': Number(req.body.HospitalID),
            'LocationID': Number(req.body.LocationID)
          }

        }, function (err, resp) {
          if (err) {
            res.send(err)
          } else {
            res.send({ status: true, msg: "User Updated Successfully" });
          }
        });
    }
  })
});

function getIncrementedNewUserID(cb) {
  usersModel.find((err, response) => {
    if (err) {
      cb(err, null)
    } else {
      cb(null, response)
    }
  }).sort({ NewUserID: -1 }).limit(1);
};

function createPassword(password) {
  return bcrypt_1.hashSync(password, bcrypt_1.genSaltSync(9));
}

// var data = createPassword('pass@1234')
// console.log(data)
module.exports = router;



