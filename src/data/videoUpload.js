const express = require('express');
const router = express.Router();
const videoModel = require('../../model/videoModel')
const filePath = 'D:/memes_api/public/videos';
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
    const upload = multer({ storage: storage }).any('video');
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
                mediaSource: 'http://' + req.headers.host + '/videos/' + file.filename
            }
        });
        console.log(results)
        res.status(200).json(results);
    });
});

router.post('/saveVideo', (req, res) => {
    console.log('Req.Body', req.body)
    var data = {}
    getVideoID(function (e, n) {
        if (n.length != 0) {
            data.VideoID = n[0].VideoID + 1
        } else {
            data.VideoID = 1
        }
        data.ArtistName = req.body.ArtistName;
        data.Dailogue = req.body.Dailogue;
        data.Genre = req.body.Genre;
        data.Description = req.body.Description;
        data.VideoName = req.body.VideoData[0].mediaName;
        data.VideoURl = req.body.VideoData[0].mediaSource;
        data.VideoOriginalName = req.body.VideoData[0].origMediaName;
        var saveVideoData = new videoModel(data);
        saveVideoData.save(function (err, response) {
            if (err) {
                res.send({ status: false, msg: "Sorry SomeThing Went Wrong", err: err })
            } else {
                res.send({ status: true, msg: "Video Save Successfully", data: response })
            }
        })

    })

})

function getVideoID(cb) {
    videoModel.find((err, response) => {
        if (err) {
            cb(err, null)
        } else {
            cb(null, response)
        }
    }).sort({ VideoID: -1 }).limit(1);
};

router.get('/getAllVideos', function (req, res) {
    videoModel.find({ $and: [{ RowStatus: 0 }] }, function (err, resp) {
        if (err) {
            res.send(err)
        } else {
            res.send(resp)
        }
    });
});

router.get('/getVideoById/:id', function (req, res) {
    videoModel.findOne({ _id: req.params.id }, function (err, resp) {
        if (err) {
            res.send(err)
        } else {
            res.send(resp)
        }
    });
});

router.get('/getVideoByVideoID/:id', function (req, res) {
    videoModel.findOne({ VideoID: req.params.id }, function (err, resp) {
        if (err) {
            res.send(err)
        } else {
            res.send(resp)
        }
    });
});


router.post('/remove', function (req, res) {
    videoModel.update({ _id: req.body.id }, { $set: { 'RowStatus': 1 } }, function (err, resp) {
        if (err) {
            res.send(err)
        } else {
            if (resp.n == 1) {
                res.send(resp)
            }
        }
    });
});

router.post('/searchVideos', function (req, res) {
    videoModel.find({ $and: [{ VideoOriginalName: new RegExp(req.body.name, "i") }, { RowStatus: 0 }] }, function (err, response) {
        if (err) {
            res.send(err)
        } else {
            res.send(response)
        }
    });
});

router.post('/updateVideo', (req, res) => {
    videoModel.update({ _id: req.body.Id },
        {
            $set: {
                'ArtistName': req.body.ArtistName,
                'Dailogue': req.body.Dailogue,
                'Genre': req.body.Genre,
                'Description': req.body.Description
            }
        }, function (err, resp) {
            if (err) {
                res.send({ status: false, msg: "Sorry SomeThing Went Wrong", err: err })
            } else {
                if (resp.n == 1) {
                    res.send({ status: true, msg: "Video Updated Successfully", data: resp })
                } else {
                    res.send({ status: false, msg: "Video Not Updated", err: err })
                }
            }
        });
});



module.exports = router;



