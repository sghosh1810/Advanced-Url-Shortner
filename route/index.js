//Import Libs
const express = require('express')
const router = express.Router()
const monk = require('monk')

//MongoDb connect using monk
const db = monk(process.env.DATABASE_URI);

//Fetch urls
const urls = db.get('urls');

//Creates index unique to avoid duplicates
urls.createIndex({slug:1},{unique:true});


router.get('/', (req,res) => {
    res.render('index',{error:null,created:null})
})

router.get('/:id', async (req, res, next) => {
    const { id: slug } = req.params;
    if(slug!="url"){
        try {
            const url = await urls.findOne({ slug });
            if (url) {
                return res.redirect(url.url);
            }   
            return res.status(404).redirect('static/404.html');
        } catch (error) {
            return res.status(404).redirect('static/404.html');
        }
    } else {
        res.redirect('/')
    }
    
});

module.exports=router