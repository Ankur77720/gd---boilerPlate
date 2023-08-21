const mongoose = require('mongoose')
const plm = require('passport-local-mongoose')
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
});
userSchema.plugin(plm)
module.exports = mongoose.model('User', userSchema);
