//Import Libs
const express = require('express');
const router = express.Router();
const yup = require('yup')
const {nanoid} = require('nanoid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Load Url model
const Url = require('../models/Url');const { json } = require('body-parser');
Url.collection.createIndex({"slug":1},{unique: true})

//Load Notification Model
const Notification = require('../models/Notification');


Url.collection.createIndex({"slug":1},{unique: true});

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
router.post('/', async(req, res, next) => {

    let { slug, url, userid, validFor } = req.body;

    //Store logs in session
    const sessionNotification = req.session.notifications;
    var notifications = "";
    if(sessionNotification) {
        notifications = req.session.notifications;
    } else {
        notifications = await Notification.find({userid:req.user.id}).sort({createdOn:-1}).limit(5);
        req.session.notifications = notifications;
    }

    //Actual render logic
    try {

        //Stop them from using hostname!
        if (url.includes(process.env.HOST)) {
            throw new Error('Stop it. 🛑');
        }

        //If slug not given genrate random
        if (!slug) {
            slug = nanoid(7);
        } else {
            if(slug==="url" || slug==="dashboard" || slug==="users"){
                throw new Error('Banned words');
            }
            const existing = await Url.findOne({ slug });
            if (existing) {
                throw new Error('Slug in use. 🍔');
            }
        }
        slug = slug.toLowerCase();

        //Validate slug and url format
        await urlSchema.validate({
            slug,
            url
        });

        if(validFor==='') {
            validFor=0;
        }

        const newUrl = new Url({
            url,
            slug,
            userid,
            validFor
        });


        const created = await newUrl.save();
        res.render('dashboard',{
            user:req.user,
            error:null,
            created:process.env.HOST+"/"+created.slug,
            notifications: notifications
        })

    } catch (error) {
        res.render('dashboard',{
            user:req.user,
            error:error.message,
            created:null,
            notifications: notifications
        })
    }
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

router.post('/url', async(req,res) => {
    console.log(req.body);
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