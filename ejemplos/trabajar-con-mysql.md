# Paso 1: 
Cambiar la variable de entorno DATABASE_URL
```bash
DATABASE_URL="mysql://usuaio_bd:pass_usuario_db@host:puerto/base_datos"
```
ejemplo
DATABASE_URL="mysql://root:root_passwor123@localhost:3306/portafolio_db"
# Paso 2:
Intalar el la libreria para manejar mysql
```bash
npm install @prisma/adapter-mariadb@6.19.3
```
# Paso 3
Modificacion de archivo schema.prisma que se encuentra en el directorio primas
```bash
# si tieene postgres
datasource db {
  provider = "postgresql"
}
# por
datasource db {
  provider = "mysql"
}
```
# Paso 4
Modificar prisma.js
```bash
const { PrismaPg } = require('@prisma/adapter-pg');
#por
const { PrismaPg } = require('@prisma/adapter-mariadb')
```

# Paso 5
 1. Eliminar la migracion si realizaron la cual se encuentra en /prima/migrations 
 2. Modifcar migration_lock.toml si esta generado 
   ```bash
   provider = "postgresql"
   # por
   provider = "mysql"
   ```
 3. Ejecutar la migracion 
  ```bash
    # Crear las tablas a partir del esquema
      npx prisma migrate dev --name init
      # Generar el cliente Prisma
      npx prisma generate
  ```
