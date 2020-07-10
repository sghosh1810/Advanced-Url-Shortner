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

router.get('/', async(req,res) => {
    res.redirect(`index`)
})

router.post('/', async(req,res) => {
    let { slug, url } = req.body;
    try {
        if (url.includes(process.env.HOST)) {
            throw new Error('Stop it. 🛑');
        }
        if (!slug) {
            slug = nanoid(7);
        } else {
            const existing = await Url.findOne({ slug });
            if (existing) {
                throw new Error('Slug in use. 🍔');
            }
        }
        slug = slug.toLowerCase();
        const newUrl = new Url({
            url,
            slug,
        });
        await urlSchema.validate({
            slug,
            url,
        });
        const created = await newUrl.save();
        console.log(created)
        res.render(`index`,{error:null,created:process.env.HOST+"/"+created.slug})
      } catch (error) {
        res.render(`index`,{error:error.message,created:null})
    }
})
module.exports=router
