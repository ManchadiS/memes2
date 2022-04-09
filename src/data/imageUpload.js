const express = require('express');
const router = express.Router();
const imageModel = require('../../model/imageModel')
const filePath = 'D:/memes_api/public/images';
const multer = require("multer");
const path = require('path');
router.post('/upload', (req, res) => {
    const storage = multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, (filePath));
        },
        filename: (req, file, callback) => {
            callback(null, Date.now() + file.originalname);
        }
    });
    const upload = multer({ storage: storage }).any('img');
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).send({
                message: helper.getErrorMessage(err)
            });
        }
        let results = req.files.map((file) => {
            return {
                mediaName: file.filename,
                origMediaName: file.originalname,
                mediaSource: 'http://' + req.headers.host + '/images/' + file.filename
            }
        });
        console.log(results)
        res.status(200).json(results);
    });
});

router.post('/saveImage', (req, res) => {
    console.log('Req.Body', req.body)
    var data = {}
    getImageID(function (e, n) {
        if (n.length != 0) {
            data.ImageID = n[0].ImageID + 1
        } else {
            data.ImageID = 1
        }
        data.Description = req.body.Description;
        data.ImageName = req.body.ImgName;
        data.ImageURL = req.body.ImageData[0].mediaSource;
        data.ImageOriginalName = req.body.ImageData[0].origMediaName;
        data.mediaName =  req.body.ImageData[0].mediaName;
        var saveImageData = new imageModel(data);
        saveImageData.save(function (err, response) {
            if (err) {
                res.send({ status: false, msg: "Sorry SomeThing Went Wrong", err: err })
            } else {
                res.send({ status: true, msg: "Image Save Successfully", data: response })
            }
        })

    })

})

function getImageID(cb) {
    imageModel.find((err, response) => {
        if (err) {
            cb(err, null)
        } else {
            cb(null, response)
        }
    }).sort({ ImageID: -1 }).limit(1);
};

router.get('/getAllImages', function (req, res) {
    imageModel.find({ $and: [{ RowStatus: 0 }] }, function (err, resp) {
        if (err) {
            res.send(err)
        } else {
            res.send(resp)
        }
    });
});

router.get('/getImageById/:id', function (req, res) {
    imageModel.findOne({ _id: req.params.id }, function (err, resp) {
        if (err) {
            res.send(err)
        } else {
            res.send(resp)
        }
    });
});

router.get('/getImageByImageID/:id', function (req, res) {
    imageModel.findOne({ ImageID: req.params.id }, function (err, resp) {
        if (err) {
            res.send(err)
        } else {
            res.send(resp)
        }
    });
});


router.post('/remove', function (req, res) {
    imageModel.update({ _id: req.body.id }, { $set: { 'RowStatus': 1 } }, function (err, resp) {
        if (err) {
            res.send(err)
        } else {
            if (resp.n == 1) {
                res.send(resp)
            }
        }
    });
});

router.post('/searchImages', function (req, res) {
    imageModel.find({ $and: [{ ImageName: new RegExp(req.body.name, "i") }, { RowStatus: 0 }] }, function (err, response) {
        if (err) {
            res.send(err)
        } else {
            res.send(response)
        }
    });
});

router.post('/updateImage', (req, res) => {
    imageModel.update({ _id: req.body.Id },
        {
            $set: {
                'ImageName': req.body.ImgName,
                'Description': req.body.Description
            }
        }, function (err, resp) {
            if (err) {
                res.send({ status: false, msg: "Sorry SomeThing Went Wrong", err: err })
            } else {
                if (resp.n == 1) {
                    res.send({ status: true, msg: "Image Updated Successfully", data: resp })
                } else {
                    res.send({ status: false, msg: "Image Not Updated", err: err })
                }
            }
        });
});



module.exports = router;



