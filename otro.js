const express=require('express');
const jwt=require('jsonwebtoken');
const user=require('./user');
const key=require("./key");

const app=express();

app.use(require('body-parser').json());
app.use(function(req,res,next){
    try{
    const token = req.headers.authorization.split(" ")[1]
    jwt.verify(token, key.tokenKey, function (err, payload) {
        console.log(payload)
        if (payload) {
            user.findById(payload.userId).then(
                (doc)=>{
                    req.user=doc;
                    next()
                }
            )
        } else {
           next()
        }
    })
}catch(e){
    next()
}
})
app.post('/api/auth/signin',function(req,res){
    user.findOne({email:req.body.email}).then((user)=>{
            user.comparePassword(req.body.password,(err,isMatch)=>{
                if(isMatch){
                    var token=jwt.sign({userId:user.id},key.tokenKey);
                    res.status(200).json({
                        userId:user.id,
                        user_name:user.user_name,
                        token
                    })
                }
                else{
                    res.status(400).json({message:'Invalid Password/Username'});
                }
            })
    }).catch((err)=>{
        res.status(400).json({message:'Invalid Password/Username'});
    })
})

app.listen("3001"||process.env.PORT,()=>{
    console.log('done.....')
})
