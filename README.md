# Prueba conceptual api nodejs

API de ejemplo sobre nodejs

Funcionalidades implementadas


 * ```POST /api/user``` Crear usuario: Función para la creación de un usuario con los campos indicados en el modelo de datos. El id idealmente debe ser autogenerado. 
 * ```GET "/api/user/:user_name``` ```GET "/api/user/email/:user_name``` Buscar usuario: Función que realice la búsqueda de un usuario con base  al nombre de usuario ó el correo electrónico.(user_name ó email).
 * ```PUT "/api/user/:user_name``` Modificar usuario:  Función para la modificación de un usuario con los campos indicados en el modelo de datos. 
 * ```DELETE /api/user/:user_name``` Eliminar  usuario:  Función para la eliminación de un usuario por nombre de usuario (user_name). 
 * ```POST /api/auth/login``` Implementar login y logout: Implementar método para autenticar un usuario contra la base de datos con su nombre de usuario y contraseña (user_name y password). El método debe retornar true si las credenciales son correctas y false en caso contrario.
 * ```GET /api/user/roles/:user_name``` Consultar roles de usuario: Búsqueda de roles de un usuario específica por su nombre de usuario. (user_name) 
 * ```GET /api/rol/permission/:rol_name``` Consultar permisos de rol: Búsqueda de permisos de un rol por el nombre del rol (role_name). 
 * ```GET /api/user/permissions/:user_name/:url``` Consultar permiso de usuario : Crear una función que reciba dos parámetros: nombre de usuario (user_name en tabla USER)  url (url en tabla PERMISSION) .    Y determine si el usuario dado tiene un permiso con ese url, retornando true o false 
 * Implementar JWT y encriptación:  Implementación de método de autenticación por token JWT y que permita la encriptación en base de datos de la contraseña (password).


# Despliegue

Instalación de paquetes

```bash
npm i
```

Ejecución proyecto
```bash
npm start
```


# Pruebas

## Usuarios
### Crear usuario
```bash
curl -X POST http://localhost:3000/api/user \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "otro",
    "user_name": "otro",
    "email": "otro@gmail.com",
    "password": "123456",
    "active": true
}'
```

### Crear usuario con rol

Nota: Se deben crear los roles y permisos primero para que todo funcione correctamente

```bash
curl -X POST http://localhost:3000/api/user \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "otro",
    "user_name": "otro",
    "email": "otro@gmail.com",
    "password": "123456",
    "active": true,
    "roles": ["Usuario"]
}'
```


### Buscar usuario por user_name
```bash
curl -X GET http://localhost:3000/api/user/otro
```

### Buscar usuario por email
```bash
curl -X GET http://localhost:3000/api/user/email/otro@gmail.com 
```

### Modificar usuario
```bash
curl -X PUT http://localhost:3000/api/user/otro \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Otro Perez",
    "user_name": "otro",
    "email": "otroperez@gmail.com",
    "password": "12345678",
    "active": false
}'
```


### Modificar usuario asignando roles
```bash
curl -X PUT http://localhost:3000/api/user/otro \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Otro Perez",
    "user_name": "otro",
    "email": "otroperez@gmail.com",
    "password": "12345678",
    "active": true,
    "roles": ["Usuario"]
}'
curl -X PUT http://localhost:3000/api/user/otro \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Admin Perez",
    "user_name": "admin",
    "email": "admin@gmail.com",
    "password": "12345678",
    "active": true,
    "roles": ["Administrador"]
}'
```

### Borrar usuario
```bash
curl -X DELETE http://localhost:3000/api/user/otro
```

### Login usuario
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{
    "user_name": "otro",
    "password": "123456"
}'
```

## Permisos

### Crear permiso
```bash
curl -X POST http://localhost:3000/api/permission \
  -H 'Content-Type: application/json' \
  -d '{
    "permission_name": "Sumar",
    "description": "Permiso para que el usuario pueda sumar",
    "url": "sumar",
    "active": true
}'

curl -X POST http://localhost:3000/api/permission \
  -H 'Content-Type: application/json' \
  -d '{
    "permission_name": "Restar",
    "description": "Permiso para que el usuario pueda restar",
    "url": "restar",
    "active": true
}'

curl -X POST http://localhost:3000/api/permission \
  -H 'Content-Type: application/json' \
  -d '{
    "permission_name": "Multiplicar",
    "description": "Permiso para que el usuario pueda multiplicar",
    "url": "multiplicar",
    "active": true
}'

curl -X POST http://localhost:3000/api/permission \
  -H 'Content-Type: application/json' \
  -d '{
    "permission_name": "Dividir",
    "description": "Permiso para que el usuario pueda dividir",
    "url": "dividir",
    "active": true
}'
```
### Lista de permission
```bash
curl -X GET http://localhost:3000/api/permission 
```

## Roles

### Crear rol



```bash
curl -X POST http://localhost:3000/api/rol \
  -H 'Content-Type: application/json' \
  -d '{
    "role_name": "Usuario",
    "description": "Usuarios del sistema",
    "active": true,
    "permissions": ["Sumar", "Restar"]
}'

curl -X POST http://localhost:3000/api/rol \
  -H 'Content-Type: application/json' \
  -d '{
    "role_name": "Administrador",
    "description": "Administradores del sistema",
    "active": true,
    "permissions": ["Sumar", "Restar", "Multiplicar", "Dividir"]
}'
```

### Lista de roles
```bash
curl -X GET http://localhost:3000/api/rol 
```


## Permisos implementados

### Consultar roles de usuario
```bash
curl -X GET http://localhost:3000/api/user/roles/otro
```
### Consultar permisos de rol
```bash
curl -X GET http://localhost:3000/api/rol/permission/Usuario
curl -X GET http://localhost:3000/api/rol/permission/Administrador
```

### Consultar permiso de usuario
```bash
curl -X GET http://localhost:3000/api/user/permissions/otro/sumar
curl -X GET http://localhost:3000/api/user/permissions/otro/restar
curl -X GET http://localhost:3000/api/user/permissions/otro/multiplicar
curl -X GET http://localhost:3000/api/user/permissions/otro/dividir
```




