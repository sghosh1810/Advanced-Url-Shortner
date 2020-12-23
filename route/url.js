const express = require('express')
const router = express.Router()
const yup = require('yup')
const {nanoid} = require('nanoid');
const {createShortURL} = require('./util/util');

// Load Url model
const Url = require('../models/Url');
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
    createShortURL(req,res,'index');
})
module.exports=router
