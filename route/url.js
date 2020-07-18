const express = require('express')
const router = express.Router()
const yup = require('yup')
const {nanoid} = require('nanoid');

// Load Url model
const Url = require('../models/Url');;
Url.collection.createIndex({"slug":1},{unique: true})

//Validate schema
const urlSchema = yup.object().shape({
    slug: yup.string().trim().matches(/^[\w\-]+$/i),
    url: yup.string().trim().url().required(),
});

//Redirect on get request
router.get('/', async(req,res) => {
    res.redirect('/')
})

router.post('/', async(req,res) => {
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

        const newUrl = new Url({
            url,
            slug,
            userid,
            validFor
        });

        const created = await newUrl.save();
        res.render(`index`,{error:null,created:process.env.HOST+"/"+created.slug,layout:'layouts/frontend/layout'})
      } catch (error) {
        res.render(`index`,{error:error.message,created:null})
    }
})
module.exports=router
