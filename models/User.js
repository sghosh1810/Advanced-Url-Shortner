const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  /*
  Name: Name
  Usage: Full Name of user
  Example: "John Doe"
  */
  name: {
    type: String,
    required: true
  },
  /*
  Name: Email
  Usage: Actual email of user
  Example: "user@example.com"
  */
  email: {
    type: String,
    required: true
  },
  /*
  Name: Password
  Usage: Stores encrypted password.
  Example: "ahjfghjagfuygauhjagfuyaas214d4asfadshjkfg"
  */
  password: {
    type: String,
    required: true
  },
  /*
  Name: Date
  Usage: Stores registration date of user
  Example: 2020-07-13T11:21:34.562+00:00
  */
  date: {
    type: Date,
    default: Date.now
  },
  /*
  Name: isAdmin
  Usage: Signifies if user is admin
  */
  isAdmin: {
    type: Boolean,
    default:false
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;