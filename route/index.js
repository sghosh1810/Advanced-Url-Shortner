//Import Libs
const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Load Url model
const Url = require('../models/Url');;
Url.collection.createIndex({"slug":1},{unique: true})

router.get('/', forwardAuthenticated,(req,res) => {
    res.render('index',{error:null,created:null,layout:'layouts/frontend/layout'})
})

router.get('/dashboard', ensureAuthenticated, (req, res) =>
    res.render('dashboard', {
        user: req.user
    })
);

router.get('/:id', async (req, res, next) => {
    const { id: slug } = req.params;
    if(slug!="url"){
        try {
            const url = await Url.findOne({ slug });
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