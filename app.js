const Express = require("express");
const BodyParser = require("body-parser");
const jwt=require('jsonwebtoken');
const Mongoose = require("mongoose");

const key=require("./key");

// Modelos
const UserModel=require("./user");
const RolModel=require("./rol");
const PermissionModel=require("./permission");


//Base de datos
Mongoose.connect("mongodb://localhost/prueba");



// Express

var app = Express();

app.use(BodyParser.json());

app.use(function(req,res,next){
    try{
        const token = req.headers.authorization.split(" ")[1]
        jwt.verify(token, key.tokenKey, function (err, payload) {
            console.log(payload)
            if (payload) {
                UserModel.findById(payload.userId).then(
                    (doc)=>{
                        console.log("El usuario encontrado es: ", doc)
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
app.use(BodyParser.urlencoded({ extended: true }));


// Rutas

//Crear usuario
app.post("/api/user", async (request, response) => {
    console.log("Intentando registrar un nuevo usuario ", request.body)
    try {
        var user = new UserModel(request.body);
        var result = await user.save();
        console.log("El resultado es ", result, " - ", user)
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});
//Buscar usuario por username
app.get("/api/user/:user_name", async (request, response) => {
    try {
        var result = await UserModel.findOne({"user_name":request.params.user_name}).exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});
//Actualizar usuario por username
app.put("/api/user/:user_name", async (request, response) => {
    try {
        var u = await UserModel.findOne({"user_name":request.params.user_name}).exec();
        var user = new UserModel(request.body);
        u.name = user.name;
        u.user_name = user.user_name;
        u.email = user.email;
        u.password = user.password;
        u.active = user.active;
        var result = await u.save();
        
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});
//Buscar usuario por correo
app.get("/api/user/email/:email", async (request, response) => {
    try {
        var result = await UserModel.findOne({"email":request.params.email}).exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});
//Borrar usuario
app.delete("/api/user/:user_name", async (request, response) => {
    console.log("Borrando: ", request.params.user_name)
    try {
        var result = await UserModel.deleteOne({"user_name":request.params.user_name}).exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

//Login
app.post('/api/auth/login',function(req,res){
    UserModel.findOne({email:req.body.user_name}).then((user)=>{
            user.comparePassword(req.body.password,(err,isMatch)=>{
                if(isMatch){
                    var token=jwt.sign({userId:user.id},key.tokenKey);
                    res.status(200).json({
                        userId:user.id,
                        user_name:user.user_name,
                        name:user.name,
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
//Logout
app.get("/api/auth/logout", async (request, response) => {
    try {
        var result = await UserModel.findOne({"user_name":request.params.user_name}).exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});
//Roles usuario
app.get("/api/user/roles/:user_name", async (request, response) => {
    try {
        var result = await UserModel.findOne({"user_name":request.params.user_name}).exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});
//Permisos Rol
app.get("/api/user/:user_name", async (request, response) => {
    try {
        var result = await UserModel.findOne({"user_name":request.params.user_name}).exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});
//Permisos Usuario
app.get("/api/user/:user_name", async (request, response) => {
    try {
        var result = await UserModel.findOne({"user_name":request.params.user_name}).exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});


// Servidor

app.listen(3000, () => {
    console.log("Listening at :3000...");
});
