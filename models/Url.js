//Model for url format
const mongoose = require('mongoose');
/*
 TODO:
 Update  model to support
 -password
 -number of click
*/
const UrlSchema = new mongoose.Schema({
  /*
  Name: Url
  Usage: Actual destination url
  Example: https://example.com
  */
  url: {
    type: String,
    required: true
  },
  /*
  Name: Slug
  Usage: Redirects to destination url
  Example: https://yourdomain.com/${slug} will go to url defined above i.e https://example.com
  */
  slug: {
    type: String,
    required: true
  },
  /*
  Name: Userid
  Usage: Identfies user by id
  Example: "2f36sdflasjfasf" or "${user.id}" for  authenticated user. "default" for all non-authed users
  */
  userid: {
    type: String,
    required: true,
    default: "public"
  },
  /*
  Name: CreatedOn
  Usage: Stores the date the url was created on
  Example: "2020-07-13T11:21:34.562+00:00"
  */
  createdOn: {
    type: Date,
    required: true,
    default: Date.now()
  },
  /*
  Name: validFor
  Usage: Stores the number of days the url is valid
  Example: 30
  */
  validFor: {
    type: Number,
    required: false,
  },
  /*
  Name: clickCount
  Usage: Keeps track of number of times short url has been used
  Example: 10
  */
  clickCount: {
    type: Number,
    required: true,
    default: 0
  },
  /*
  Name: clickCount
  Usage: Keeps track of number of times short url has been used
  Example: 10
  */
 visitors: {
   type: Array,
   required: true,
   default:[]
 }
});

const Url = mongoose.model('Url', UrlSchema);

module.exports = Url;