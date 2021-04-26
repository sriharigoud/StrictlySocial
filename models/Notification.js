const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    action: { //follow,like,comment,share,tag and mention
        type: String,
        required: true
    },
    post:{
        type: Schema.Types.ObjectId,
        ref: "post",
        default: null
    },
    date: {
        type: Date,
        default: Date.now()
    }
})


module.exports = Notification = mongoose.model('notification', NotificationSchema);