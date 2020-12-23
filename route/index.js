//Import Libs
const express = require('express');
const router = express.Router();
const unirest = require('unirest');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Load Url model
const Url = require('../models/Url');;
Url.collection.createIndex({"slug":1},{unique: true})



//Redirect Public Homepage 
router.get('/', forwardAuthenticated,(req,res) => {
    res.render('index',{error:null,created:null,layout:'layouts/frontend/layout'})
})

//Redirect short url on basis of slugs
router.get('/:id', async (req, res, next) => {
    const { id: slug } = req.params
    try {
        const url = await Url.findOne({ slug });
        //If url is found do the other steps
        if (url) {

            //Access GEO Location API to get user location data
            let {status,country,countryCode} = await unirest.get(`http://ip-api.com/json/${req.ip}`)
            if (status!="success") {
                country = "Others"
                countryCode = "OT"
            }
            
            //Make Visitor Object
            const visitors = {"ip":req.ip.toString(),"userAgnet":req.headers['user-agent'],"country":country,"countryCode":countryCode}

            //If the url has a validity limit
            if (url.validFor) {
                //Check if url is valid on current date
                if(((Date.now()-url.createdOn)/(1000*60*60*24))<=url.validFor){
                    console.log("If date valid");
                    await Url.updateOne({slug:slug} ,
                        {$set:{clickCount:url.clickCount+1},
                        $addToSet:{visitors:visitors}},
                        (err,res) => {
                        if (err) throw err;
                    })
                    return res.redirect(url.url);
                } else {
                    //Delete the url from db if the validity is over
                    await Url.deleteOne({_id:url.id}, (err,res) => {
                            if(err) throw err;
                    })
                    res.redirect('static/404.html');
                }
            } else {
                //If url.validFor is not set it is indefinately valid
                await Url.updateOne({slug:slug} ,
                    {$set:{clickCount:url.clickCount+1},
                    $addToSet:{visitors:visitors}},
                    (err,res) => {
                    if (err) throw err;
                })
                return res.redirect(url.url);
            }
        }
        return res.status(404).redirect('static/404.html');
    } catch (error) {
        console.log(error);
        return res.status(404).redirect('static/404.html');
    }
});



module.exports=router