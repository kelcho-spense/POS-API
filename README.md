

# Point of Sale System

## Project Overview
This project is a Point of Sale (POS) system that allows users to manage sales transactions, inventory, and customers. The system is designed to be user-friendly and intuitive, with a focus on ease of use and efficiency.

Using the Point of Sale Software, it will help you to determine the critical level of stocks. With POS System, you will be able to track products. Products information like sales. The system assists to generate reports for price adjustment. It helps make the record-keeping and accounting simpler.

## Features
- Inventory Management
- Company Management
- Category Management
- Stock Management
- Customer Management
- Product Management
- Customer Registration
- Suppliers Management
- Secure login
- Sales Management
- Sales Inventory
- Payments (Cash Basis)
- Product Inventory


## Tech Stack
- NestJS
- PostgreSQL
- Prisma ORM
- TypeScript
- JWT Authentication

## Prerequisites
- Node.js (v20 or higher)
- PostgreSQL (v16 or higher)
- npm or pnpm

## Getting Started

### 1. Clone the Repository
```bash
git clone 
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
# Copy example env file
cp .env.example .env

# Update .env with your database credentials
DATABASE_URL="postgresql://username:password@localhost:5432/pos_db"
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# (Optional) Seed the database
npx prisma db seed
```

### 5. Start the Application
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication
All endpoints except registration and login require JWT authentication.
Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Available Endpoints
Detailed API documentation can be found in `app.http`

#### Users
- POST /users - Create user
- GET /users - List users
- GET /users/:id - Get user details
- PATCH /users/:id - Update user
- DELETE /users/:id - Delete user



## Database Schema
For detailed database design documentation, see [Database Design](./prisma/Database.design.md)

## Development

### Running Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Making Schema Changes
1. Modify `schema.prisma`
2. Create migration:
```bash
npx prisma migrate dev --name describe_your_changes
```

### Code Style
- Follow NestJS best practices
- Use TypeScript strict mode
- Maintain consistent naming conventions
- Write unit tests for new features

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Support
For support, email support@tasklistms.com or create an issue in the repository.

