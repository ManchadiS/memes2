var express = require('express');
var router = express.Router();

const misReport = require('../src/data/admin');
const otp = require('../src/data/otp');
const rolesModel = require('../src/data/roles')
const UserRights = require('../src/data/userRights');
const VideoUpload = require('../src/data/videoUpload');
const ImageUpload = require('../src/data/imageUpload');

router.use("/admin", misReport);
router.use('/otp', otp);
router.use('/roles', rolesModel);
router.use('/userRights', UserRights);
router.use('/video', VideoUpload);
router.use('/image', ImageUpload)
module.exports = router;

