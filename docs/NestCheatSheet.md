### Cheat Sheet commands

- Create a resource ie User CRUD: `nest g resource <resource-name>`

- Create a new module: `nest g module <module-name>`
- Create a new controller: `nest g controller <controller-name>`
- Create a new service: `nest g service <service-name>`
- Create a new provider: `nest g provider <provider-name>`
- Create a new decorator: `nest g decorator <decorator-name>`
- Create a new filter: `nest g filter <filter-name>`
- Create a new gateway: `nest g gateway <gateway-name>`
- Create a new guard: `nest g guard <guard-name>`
- Create a new interceptor: `nest g interceptor <interceptor-name>`
- Create a new middleware: `nest g middleware <middleware-name>`
- Create a new pipe: `nest g pipe <pipe-name>`

### set up prisma
- `pnpm add -D prisma @prisma/client`   // install prisma
- `npx prisma init`  // create prisma folder
- `npx prisma generate`  // generate prisma client
- `npx prisma migrate dev --name <migration name>`  // create migration
- `npx prisma studio`  // open prisma studio
- `npx prisma db push `  // push migration to database

###Auth Libs to install

passport-local that implements a username/password authentication mechanism

### Passport requirements:
- `pnpm add @nestjs/passport passport passport-jwt`  // install passport and passport jwt
- `pnpm add -D @types/passport @types/passport-jwt`  // install passport types

### JWT requirements:
- `pnpm add @nestjs/jwt `  // install jsonwebtoken

### Bcrypt requirements:
- `pnpm add bcrypt`  // install bcrypt
- `pnpm add -D @types/bcrypt`  // install bcrypt types