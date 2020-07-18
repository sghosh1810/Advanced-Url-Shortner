//Import Libs
const express = require('express');
const router = express.Router();
const yup = require('yup')
const {nanoid} = require('nanoid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Load Url model
const Url = require('../models/Url');const { json } = require('body-parser');
;
Url.collection.createIndex({"slug":1},{unique: true})

//Validate schema
const urlSchema = yup.object().shape({
    slug: yup.string().trim().matches(/^[\w\-]+$/i),
    url: yup.string().trim().url().required(),
});



//Redirect to Dashboard if authenticated 
router.get('/', ensureAuthenticated, (req, res) =>
    res.render('dashboard', {
        user: req.user,
        error: null,
        created: null
    })
);


//Shorten url core logic 
router.post('/', async(req, res, next) => {
    console.log(req.body);
    let { slug, url, userid, validFor } = req.body;
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
        res.render('dashboard',{user:req.user,error:null,created:process.env.HOST+"/"+created.slug})
        } catch (error) {
        res.render('dashboard',{user:req.user,error:error.message,created:null})
    }
});

router.get('/url', ensureAuthenticated,async(req,res) => {
    const urls = await Url.find({userid:req.user.id}, (err,res) => { if(err) throw err; })
    res.render('urlhistory',{user:req.user,urls:urls,created:null,error:null})
})

router.post('/url', async(req,res) => {
    console.log(req.body);
    res.send('Got it');
});

module.exports = router;