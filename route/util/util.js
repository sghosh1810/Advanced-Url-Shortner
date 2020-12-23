const yup = require('yup')
const {nanoid} = require('nanoid');

// Load Url model
const Url = require('../../models/Url');
Url.collection.createIndex({"slug":1},{unique: true})

//Load Notification Model
const Notification = require('../../models/Notification');
const { render } = require('ejs');

//Validate schema
const urlSchema = yup.object().shape({
    slug: yup.string().trim().matches(/^[\w\-]+$/i),
    url: yup.string().trim().url().required(),
});


async function createShortURL (req,res,page) {
    let { slug, url, userid, validFor } = req.body;
    let notifications = "";

    //Store logs in session
    if(page == 'dash'){
        const sessionNotification = req.session.notifications;
        if(sessionNotification) {
            notifications = req.session.notifications;
        } else {
            notifications = await Notification.find({userid:req.user.id}).sort({createdOn:-1}).limit(5);
            req.session.notifications = notifications;
        }
    }

    layout = (page=='dash')?'layouts/dashboard/layout':'layouts/frontend/layout';
    renderPage = (page=='dash')?'dashboard':'index';

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
        res.render(renderPage,{
            user:req.user,
            error:null,
            created:process.env.HOST+"/"+created.slug,
            notifications: notifications,
            layout:layout
        })

    } catch (error) {
        res.render(renderPage,{
            user:req.user,
            error:error.message,
            created:null,
            notifications: notifications,
            layout:layout
        })
    }
}

module.exports = {createShortURL:createShortURL}