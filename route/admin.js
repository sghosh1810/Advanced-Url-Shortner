const express = require('express')
const router = express.Router()
const {ensureAuthenticatedAdmin} =  require('../config/auth');
const User = require('../models/User');
const Url = require('../models/Url');

router.get('/', ensureAuthenticatedAdmin, async(req,res) => {
    const usercount = await User.countDocuments({});
    const urlcount = await Url.countDocuments({});
    const allurls = await Url.find({});
    let clickcount = 0;
    allurls.forEach(url => {
        clickcount+=url.clickCount;
    });
    res.render('admin/admindashboard',{
        user:req.user,
        card:{usercount:usercount,urlcount:urlcount,lastrefresh:new Date().toLocaleTimeString(),clickcount:clickcount},
        alert:req.notifications ? req.notifications.success : null,
        error:req.notifications ? req.notifications.error : null
    })
})

router.get('/alluser', ensureAuthenticatedAdmin, async(req,res) => {
    const users = await User.find({}).select('name email date _id');
    res.render('admin/alluser',{
        user:req.user,
        users:users,
        alert:null,
        error:null
    })
})

router.get('/allurl', ensureAuthenticatedAdmin,async(req,res) => {
    const urls = await Url.find({});
    res.render('admin/allurl',{
        user:req.user,
        urls:urls,
        alert:req.notifications ? req.notifications.success : null,
        error:req.notifications ? req.notifications.error : null
    })
})

router.post('/allurl/deleteurl', async(req,res) => {
    try {
        await Url.deleteOne({slug:req.body.slug})
        res.notifications = {};
        res.notifications.success = 'Successfully deleted slug with url' + req.body.slug;
        res.redirect('/dashboard/admin/allurl');
    } catch(err) {
        res.notifications.error = 'Unknown error occured';
        res.redirect('/dashboard/admin/allurl');
    }
})

router.post('/alluser/deleteuser', async(req,res) => {
    try {
        await User.deleteOne({_id:req.body.id})
        res.notifications = {};
        res.notifications.success = 'Successfully deleted user';
        res.redirect('/dashboard/admin/alluser');
    } catch(err) {
        res.notifications.error = 'Unknown error occured';
        res.redirect('/dashboard/admin/alluser');
    }
})
module.exports=router