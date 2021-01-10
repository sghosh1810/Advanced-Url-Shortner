//Import Libs
const express = require('express');
const router = express.Router();
const yup = require('yup')
const {nanoid} = require('nanoid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const {createShortURL} = require('./util/util'); 

// Load Url model
const Url = require('../models/Url');
Url.collection.createIndex({"slug":1},{unique: true})

//Load Notification Model
const Notification = require('../models/Notification');


//Validate schema
const urlSchema = yup.object().shape({
    slug: yup.string().trim().matches(/^[\w\-]+$/i),
    url: yup.string().trim().url().required(),
});



//Redirect to Dashboard if authenticated 
router.get('/', ensureAuthenticated, async(req, res) => {

    //Store logs in session
    const sessionNotification = req.session.notifications;
    let notifications = "";
    if(sessionNotification) {
        notifications = req.session.notifications;
    } else {
        notifications = await Notification.find({userid:req.user.id}).sort({createdOn:-1}).limit(5);
        req.session.notifications = notifications;
    }
    //Render the actual page
    res.render('dashboard', {
        user: req.user,
        error: null,
        created: null,
        notifications: notifications
    })
});


//Shorten url core logic 
router.post('/', async(req, res) => {
    await createShortURL(req,res,'dash');
});

router.get('/url', ensureAuthenticated,async(req,res) => {
    const urls = await Url.find({userid:req.user._id}, (err,res) => { if(err) throw err; })
    //console.log(urls);
    res.render('urlhistory',{
        user:req.user,
        urls:urls,
        alert:null,
        error:null
    })
})

router.post('/url', ensureAuthenticated,async(req,res) => {
    try {
        await Url.deleteOne({slug:req.body.slug})
        const urls = await Url.find({userid:req.user.id}, (err,res) => { if(err) throw err; })
        res.render('urlhistory',{
            user:req.user,
            urls:urls,
            alert:"Successfully deleted the url with slug - "+req.body.slug,
            error:null
        })

    } catch(err) {
        res.render('urlhistory',{
            user:req.user,
            urls:urls,
            alert:null,
            error:err.message
        })
    }
});

module.exports = router;