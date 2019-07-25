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

// Funciones auxiliares

//Relacionar roles con los de la base de datos




// Rutas


// Usuarios

// Crear usuario
app.post("/api/user", async (request, response) => {
    try {
    
        let rs = request.body.roles
        let body = request.body
        delete body.roles
        
        var user = new UserModel(body);
        
        for(let i=0;i<rs.length;i++){
          try {
            let result = await RolModel.findOne({"role_name":rs[i]}).exec();
            //Pendiente ver si es valido
            user.roles.push(result)
          }catch(error){
            console.log(error)
          }
        }
        var result = await user.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});
// Buscar usuario por username
app.get("/api/user/:user_name", async (request, response) => {
    try {
        var result = await UserModel.findOne({"user_name":request.params.user_name}).exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});
// Actualizar usuario por username
app.put("/api/user/:user_name", async (request, response) => {
    try {
        var u = await UserModel.findOne({"user_name":request.params.user_name}).exec();
        var user = new UserModel(request.body);
        u.name = user.name;
        u.user_name = user.user_name;
        u.email = user.email;
        u.password = user.password;
        u.active = user.active;
        u.roles = []
        
        let rs = request.body.roles;
        for(let i=0;i<rs.length;i++){
          try {
            let result = await RolModel.findOne({"role_name":rs[i]}).exec();
            //Pendiente ver si es valido
            u.roles.push(result)
          }catch(error){
            console.log(error)
          }
        }
        
        var result = await u.save();
        console.log(result)
        response.send(result);
    } catch (error) {
        console.log("Error: ", error)
        response.status(500).send(error);
    }
});
// Buscar usuario por correo
app.get("/api/user/email/:email", async (request, response) => {
    try {
        var result = await UserModel.findOne({"email":request.params.email}).exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});
// Borrar usuario
app.delete("/api/user/:user_name", async (request, response) => {
    console.log("Borrando: ", request.params.user_name)
    try {
        var result = await UserModel.deleteOne({"user_name":request.params.user_name}).exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

// Login
app.post('/api/auth/login',function(req,res){
    UserModel.findOne({user_name:req.body.user_name}).then((user)=>{
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
// Logout
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
        var result = await UserModel.findOne({"user_name":request.params.user_name}).populate('roles').exec();
        response.send(result.roles);
    } catch (error) {
        response.status(500).send(error);
    }
});
//Permisos Rol
app.get("/api/rol/permission/:rol_name", async (request, response) => {
    try {
        console.log("Evaluando /api/rol/permission/", request.params.rol_name)
        var result = await RolModel.findOne({"role_name":request.params.rol_name}).populate('permissions').exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});
//Permisos Usuario
app.get("/api/user/permissions/:user_name/:url", async (request, response) => {
    try {
        var result = await UserModel.findOne({"user_name":request.params.user_name}).populate('roles').exec();  
        let rs = result.roles;
        for(let i=0;i<rs.length;i++){
          try {
            let resultP = await PermissionModel.find({'_id': { $in: rs[i].permissions }}).exec();
            for(let j=0;j<resultP.length;j++){
              if (resultP[j].url===request.params.url){
                response.send(true);
              }
            }
          }catch(error){
            console.log(error)
          }
        }
        response.send(false);
    } catch (error) {
        response.status(500).send(error);
    }
});



// Roles

// Crear rol
app.post("/api/rol", async (request, response) => {
    try {
        var rol = new RolModel(request.body);
        rol.permissions = []
        let ps = request.body.permissions;
        for(let i=0;i<ps.length;i++){
          try {
            let result = await PermissionModel.findOne({"permission_name":ps[i]}).exec();
            //Pendiente ver si es valido
            rol.permissions.push(result)
          }catch(error){
            console.log(error)
          }
        }
        var result = await rol.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

// Lista de Roles
app.get("/api/rol", async (request, response) => {
    try {
        var result = await RolModel.find({});
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});




// Permisos

// Crear permiso
app.post("/api/permission", async (request, response) => {
    try {
        var permission = new PermissionModel(request.body);
        var result = await permission.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

// Lista de permisos
app.get("/api/permission", async (request, response) => {
    try {
        var result = await PermissionModel.find({});
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});






// Servidor

app.listen(3000, () => {
    console.log("Listening at :3000...");
});
