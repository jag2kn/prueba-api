const Mongoose = require("mongoose");
Mongoose.set('useCreateIndex', true);
Mongoose.set('useNewUrlParser', true);

const RolModel=require("./rol");

var bcrypt = require('bcryptjs')


var userSchema = new Mongoose.Schema({
    name: String,
    user_name: {type:String, unique:true},
    email: String,
    password: String,
    active: Boolean,
    roles: [{ type : Mongoose.Schema.ObjectId, ref: 'rol' }]    
},{timestamps:true})


userSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
      bcrypt.hash(user.password,10).then((hashedPassword) => {
          user.password = hashedPassword;
          next();
      })
    };
    next();
}, function (err) {
    next(err)
})

userSchema.methods.comparePassword=function(candidatePassword,next){
    bcrypt.compare(candidatePassword,this.password,function(err,isMatch){
        if(err) return next(err);
        next(null,isMatch)
    })
}

module.exports = Mongoose.model("user", userSchema);
