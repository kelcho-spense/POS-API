-- 1. Create ENUM types

-- Create ENUM type for user roles
CREATE TYPE user_role AS ENUM (
    'Admin',
    'Manager',
    'Cashier',
    'Inventory Clerk',
    'Accountant',
    'Auditor',
    'Support Staff',
    'Marketing Manager',
    'Supplier'
);

-- Create ENUM type for movement types
CREATE TYPE movement_type AS ENUM (
    'addition',
    'subtraction',
    'adjustment'
);

-- Create ENUM type for payment methods
CREATE TYPE payment_method AS ENUM (
    'cash',
    'credit_card',
    'debit_card',
    'mobile_payment',
    'other'
);

-- Create ENUM type for sale statuses
CREATE TYPE sale_status AS ENUM (
    'completed',
    'refunded',
    'pending'
);

-- Create ENUM type for purchase order statuses
CREATE TYPE purchase_order_status AS ENUM (
    'pending',
    'received',
    'canceled'
);

-- 2. Create Tables

-- Companies table
CREATE TABLE companies (
    company_id SERIAL PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    tax_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table with role ENUM
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'Cashier',
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    category_name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers table
CREATE TABLE suppliers (
    supplier_id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    supplier_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table with supplier reference
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(category_id) ON DELETE SET NULL,
    supplier_id INTEGER REFERENCES suppliers(supplier_id) ON DELETE SET NULL,
    product_name VARCHAR(100) NOT NULL,
    description TEXT,
    sku VARCHAR(50) UNIQUE,
    unit_price DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(4,2) DEFAULT 0.00, -- Percentage (e.g., 5.00 for 5%)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory table
CREATE TABLE inventory (
    inventory_id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    company_id INTEGER NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0,
    reorder_level INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stock Movements table to track inventory changes
CREATE TABLE stock_movements (
    movement_id SERIAL PRIMARY KEY,
    inventory_id INTEGER NOT NULL REFERENCES inventory(inventory_id) ON DELETE CASCADE,
    movement_type movement_type NOT NULL, -- Changed to ENUM
    quantity_change INTEGER NOT NULL,
    reference VARCHAR(100), -- e.g., Sale ID, Purchase Order ID
    movement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    performed_by INTEGER REFERENCES users(user_id)
);

-- Purchase Orders table
CREATE TABLE purchase_orders (
    purchase_order_id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(supplier_id) ON DELETE SET NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expected_delivery_date TIMESTAMP,
    status purchase_order_status DEFAULT 'pending', -- Changed to ENUM
    total_amount DECIMAL(10,2) NOT NULL,
    created_by INTEGER REFERENCES users(user_id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchase Order Items table
CREATE TABLE purchase_order_items (
    purchase_order_item_id SERIAL PRIMARY KEY,
    purchase_order_id INTEGER NOT NULL REFERENCES purchase_orders(purchase_order_id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);

-- Sales table
CREATE TABLE sales (
    sale_id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    customer_id INTEGER REFERENCES customers(customer_id) ON DELETE SET NULL,
    user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    status sale_status DEFAULT 'completed' -- Changed to ENUM
);

-- Sale Items table
CREATE TABLE sale_items (
    sale_item_id SERIAL PRIMARY KEY,
    sale_id INTEGER NOT NULL REFERENCES sales(sale_id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    subtotal DECIMAL(10,2) NOT NULL
);

-- Payments table
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    sale_id INTEGER NOT NULL REFERENCES sales(sale_id) ON DELETE CASCADE,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(10,2) NOT NULL,
    payment_method payment_method NOT NULL, -- Changed to ENUM
    payment_reference VARCHAR(100)
);

-- Audit Logs table for tracking changes
CREATE TABLE audit_logs (
    audit_id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER NOT NULL,
    operation VARCHAR(10) CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by INTEGER REFERENCES users(user_id),
    old_data JSONB,
    new_data JSONB
);
