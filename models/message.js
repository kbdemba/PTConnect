const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// No group messages yet

//if you are sending, should i create a new conversation every time i sent a new message OR
//if kebba send a message to dembo, I will check to see if they are in a conversation, if they are, I will create
// a message and add the created message to the conversation.
//if they are not in a conversation, I will create a conversation then add them to that conversation, then
// i will create a message then add the message to that conversation.

// so in your inbox, the messages will have a conversation ID, so when u reply from any of that messages, it just adds the
// message to that conversation


https://stackoverflow.com/questions/30823944/mongodb-best-design-for-messaging-app/30830429#30830429

conversation {
  msg_from: ,
  msg_to: ,
  message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message"
  }
}
//this should be called Students
const MessageSchema = new Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation"
      },
    author:{}
    date: {
        type: Date,
        default: Date.now
      },
    content: String,
    Subject: String,

    user: {
            id:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
          name_to_display: String // i dont think i need this
    },
    parent_name: {first_name: String,
                 last_name: String},
    student_name: {first_name: String,
                 last_name: String},
    //dateOfBirth: in the version 2
    email: String,
    class_name: String,
    behavior: {type: String,
              default:"good"},
    messages:[{
      author:String,
      message:String,
      date: {
        type: Date,
        default: Date.now
      }
    }]

});// you can get the teacher from the classroom or i will add in v2


module.exports = mongoose.model("Parent", ParentSchema);
