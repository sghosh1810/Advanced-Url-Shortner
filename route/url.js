const express = require('express')
const router = express.Router()
const yup = require('yup')
const monk = require('monk')
const {nanoid} = require('nanoid');

//MongoDb connect using monk
const db = monk(process.env.DATABASE_URI);

//Fetch urls
const urls = db.get('urls');

//Creates index unique to avoid duplicates
urls.createIndex({slug:1},{unique:true});


const schema = yup.object().shape({
    slug: yup.string().trim().matches(/^[\w\-]+$/i),
    url: yup.string().trim().url().required(),
});

router.get('/', async(req,res) => {
    console.log('Here')
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
            const existing = await urls.findOne({ slug });
            if (existing) {
                throw new Error('Slug in use. 🍔');
            }
        }
        slug = slug.toLowerCase();
        const newUrl = {
            url,
            slug,
        };
        await schema.validate({
            slug,
            url,
        });
        const created = await urls.insert(newUrl);
        console.log(res)
        res.render(`index`,{error:null,created:process.env.HOST+"/"+created.slug})
      } catch (error) {
        res.render(`index`,{error:error.message,created:null})
    }
})

module.exports=router
