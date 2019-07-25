const Mongoose = require("mongoose");
Mongoose.set('useCreateIndex', true);
Mongoose.set('useNewUrlParser', true);

const PermissionModel=require("./permission");

module.exports = RolModel = Mongoose.model("rol", {
    role_name: String,
    description: String,
    active: Boolean,
    permissions: [{ type : Mongoose.Schema.ObjectId, ref: 'PermissionModel' }]
});
