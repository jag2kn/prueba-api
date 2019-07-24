# Prueba conceptual api nodejs

API de ejemplo sobre nodejs

Funcionalidades implementadas

 * POST "/api/user" - X (10%) Crear usuario: Función para la creación de un usuario con los campos indicados en el modelo de datos. El id idealmente debe ser autogenerado. 
 * GET "/api/user/:user_name" y GET "/api/user/email/:user_name" X (10%) Buscar usuario: Función que realice la búsqueda de un usuario con base  al nombre de usuario ó el correo electrónico.(user_name ó email).
 * PUT "/api/user/:user_name" X (10%) Modificar usuario:  Función para la modificación de un usuario con los campos indicados en el modelo de datos. 
 * DELETE "/api/user/:user_name" X (10%) Eliminar  usuario:  Función para la eliminación de un usuario por nombre de usuario (user_name). 
 * POST '/api/auth/login' Y (10%) Implementar login y logout: Implementar método para autenticar un usuario contra la base de datos con su nombre de usuario y contraseña (user_name y password). El método debe retornar true si las credenciales son correctas y false en caso contrario.
 * X (20%) Implementar JWT y encriptación:  Implementar mediante una librería de autenticación en nodejs el método de autenticación por token JWT y que permita la encriptación en base de datos de la contraseña (password). Hay muchas librerías que usted puede emplear para tal fin. 
 * (10%) Consultar roles de usuario: Búsqueda de roles de un usuario específica por su nombre de usuario. (user_name) 
 * (10%) Consultar permisos de rol: Búsqueda de permisos de un rol por el nombre del rol (role_name). 
 * (10%) Consultar permiso de usuario : Crear una función que reciba dos parámetros: nombre de usuario (user_name en tabla USER)  url (url en tabla PERMISSION) .    Y determine si el usuario dado tiene un permiso con ese url, retornando true o false 


# Despliegue

Instalación de paquetes

```bash
npm i
```

Ejecución proyecto
```bash
npm start
```


