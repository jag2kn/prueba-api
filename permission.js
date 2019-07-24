const Mongoose = require("mongoose");
Mongoose.set('useCreateIndex', true);
Mongoose.set('useNewUrlParser', true);

module.exports = PermissionModel = Mongoose.model("permission", {
    permission_name: String,
    description: String,
    url: String,
    active: Boolean,
});
