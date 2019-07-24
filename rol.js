const Mongoose = require("mongoose");
Mongoose.set('useCreateIndex', true);
Mongoose.set('useNewUrlParser', true);

module.exports = RolModel = Mongoose.model("rol", {
    role_name: String,
    description: String,
    active: Boolean,
});
