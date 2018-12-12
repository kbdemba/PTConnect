const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactFormSchema = new Schema({
    fname: String,
    lname: String,
    email1: String,
    message: String

});


module.exports = mongoose.model("ContactForm", contactFormSchema);
