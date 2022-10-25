const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
    },
    lastName: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        trim: true,
        minlength: 7,
        required: true,
    }

},
    { timestamps: true }
)

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;