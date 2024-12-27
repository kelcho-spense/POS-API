Certainly! Below is the **updated documentation** for your PostgreSQL-based Point of Sale (POS) system database. This revision incorporates the latest changes, including:

- **Removal of the `roles` table** in favor of using the `user_role` ENUM.
- **ENUMs defined with all uppercase values** without using `@map()`.
- **Adjusted table definitions** to align with the new ENUM configurations.
- **Updated SQL scripts** reflecting these changes.

---

# **Point of Sale (POS) System Database Documentation**

## **Table of Contents**

1. [Introduction](#introduction)
2. [Database Overview](#database-overview)
3. [Entity-Relationship Diagram (ERD)](#entity-relationship-diagram-erd)
4. [Enumerated Types](#enumerated-types)
5. [Tables and Descriptions](#tables-and-descriptions)
   - [1. Companies](#1-companies)
   - [2. Users](#2-users)
   - [3. Categories](#3-categories)
   - [4. Suppliers](#4-suppliers)
   - [5. Products](#5-products)
   - [6. Customers](#6-customers)
   - [7. Inventory](#7-inventory)
   - [8. Stock Movements](#8-stock-movements)
   - [9. Purchase Orders](#9-purchase-orders)
   - [10. Purchase Order Items](#10-purchase-order-items)
   - [11. Sales](#11-sales)
   - [12. Sale Items](#12-sale-items)
   - [13. Payments](#13-payments)
   - [14. Audit Logs](#14-audit-logs)
6. [Indexes](#indexes)
7. [Constraints and Relationships](#constraints-and-relationships)
8. [Security Considerations](#security-considerations)
9. [Sample Queries](#sample-queries)
10. [Best Practices](#best-practices)
11. [Future Enhancements](#future-enhancements)
12. [Appendix](#appendix)
    - [SQL Scripts](#sql-scripts)
    - [Glossary](#glossary)

---

## **Introduction**

This documentation provides a comprehensive overview of the PostgreSQL database schema designed for a Point of Sale (POS) system. It outlines the structure, relationships, and functionalities of each table, ensuring that developers, database administrators, and stakeholders can effectively understand and interact with the system.

---

## **Database Overview**

The POS system is structured to manage various aspects of a retail operation, including:

- **Company Management:** Handling multiple companies or branches.
- **User Management:** Managing system users with different roles and permissions.
- **Product and Inventory Management:** Tracking products, categories, suppliers, and inventory levels.
- **Customer Management:** Maintaining customer information and registration.
- **Sales and Payments:** Processing sales transactions and handling payments.
- **Audit Logging:** Recording changes and operations for accountability and compliance.

The database employs enumerated types (`ENUM`) to streamline role definitions and ensure data integrity.

---

## **Entity-Relationship Diagram (ERD)**

*Note: An actual ERD diagram is recommended for visual representation. Below is a textual description of key relationships.*

- **Companies** have multiple **Users**, **Categories**, **Suppliers**, **Products**, **Customers**, **Inventory**, **Purchase Orders**, and **Sales**.
- **Users** are associated with a single **Company** and have a specific **Role** (`UserRole`).
- **Products** belong to **Categories** and are supplied by **Suppliers**.
- **Inventory** tracks **Products** for each **Company**.
- **Sales** involve **Customers**, **Users**, and include multiple **Sale Items**.
- **Purchase Orders** are placed to **Suppliers** and contain multiple **Purchase Order Items**.
- **Stock Movements** track changes in **Inventory**.
- **Payments** are linked to **Sales**.
- **Audit Logs** monitor changes across all tables.

---

## **Enumerated Types**

Enumerated types (`ENUM`) are used to define specific sets of values for certain columns, enhancing data integrity and simplifying role management.

### **1. `UserRole`**

Defines the various roles a user can have within the system.

```sql
CREATE TYPE UserRole AS ENUM (
    'ADMIN',
    'MANAGER',
    'CASHIER',
    'INVENTORY_CLERK',
    'ACCOUNTANT',
    'AUDITOR',
    'SUPPORT_STAFF',
    'MARKETING_MANAGER',
    'SUPPLIER'
);
```

### **2. `PaymentMethod`**

Specifies the allowed payment methods.

```sql
CREATE TYPE PaymentMethod AS ENUM (
    'CASH',
    'CREDIT_CARD',
    'DEBIT_CARD',
    'MOBILE_PAYMENT',
    'OTHER'
);
```

### **3. `MovementType`**

Categorizes the types of inventory movements.

```sql
CREATE TYPE MovementType AS ENUM (
    'ADDITION',
    'SUBTRACTION',
    'ADJUSTMENT'
);
```

### **4. `SaleStatus`**

Indicates the current status of a sale.

```sql
CREATE TYPE SaleStatus AS ENUM (
    'COMPLETED',
    'REFUNDED',
    'PENDING'
);
```

### **5. `PurchaseOrderStatus`**

Represents the status of a purchase order.

```sql
CREATE TYPE PurchaseOrderStatus AS ENUM (
    'PENDING',
    'RECEIVED',
    'CANCELED'
);
```

### **6. `Operation`**

Captures the type of operations performed (used in audit logs).

```sql
CREATE TYPE Operation AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE'
);
```

---

## **Tables and Descriptions**

### **1. Companies**

**Purpose:** Stores information about different companies or branches using the POS system.

**Fields:**

- `company_id` (SERIAL, PRIMARY KEY): Unique identifier for the company.
- `company_name` (VARCHAR(100), NOT NULL): Name of the company.
- `address` (TEXT): Physical address of the company.
- `phone` (VARCHAR(20)): Contact phone number.
- `email` (VARCHAR(100)): Contact email address.
- `tax_id` (VARCHAR(50)): Tax identification number.
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Record creation timestamp.

**SQL Definition:**

```sql
CREATE TABLE companies (
    company_id SERIAL PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    tax_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### **2. Users**

**Purpose:** Manages system users, their roles, and associated company information.

**Fields:**

- `user_id` (SERIAL, PRIMARY KEY): Unique identifier for the user.
- `company_id` (INTEGER, NOT NULL, FOREIGN KEY): References `companies(company_id)`.
- `role` (`UserRole`, NOT NULL, DEFAULT 'CASHIER'): User's role within the system.
- `username` (VARCHAR(50), UNIQUE, NOT NULL): Unique username for login.
- `password_hash` (VARCHAR(255), NOT NULL): Hashed password for security.
- `full_name` (VARCHAR(100)): User's full name.
- `email` (VARCHAR(100), UNIQUE): User's email address.
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Record creation timestamp.
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Record update timestamp.

**SQL Definition:**

```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    role UserRole NOT NULL DEFAULT 'CASHIER',
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Notes:**

- **Role Management:** The `role` field utilizes the `UserRole` ENUM, eliminating the need for a separate `roles` table.
- **Security:** Passwords are stored as hashes to enhance security. Ensure the application uses strong hashing algorithms like bcrypt or Argon2.

---

### **3. Categories**

**Purpose:** Organizes products into various categories for better management and navigation.

**Fields:**

- `category_id` (SERIAL, PRIMARY KEY): Unique identifier for the category.
- `company_id` (INTEGER, NOT NULL, FOREIGN KEY): References `companies(company_id)`.
- `category_name` (VARCHAR(50), NOT NULL): Name of the category.
- `description` (TEXT): Description of the category.
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Record creation timestamp.

**SQL Definition:**

```sql
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    category_name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### **4. Suppliers**

**Purpose:** Manages information about suppliers who provide products to the company.

**Fields:**

- `supplier_id` (SERIAL, PRIMARY KEY): Unique identifier for the supplier.
- `company_id` (INTEGER, NOT NULL, FOREIGN KEY): References `companies(company_id)`.
- `supplier_name` (VARCHAR(100), NOT NULL): Name of the supplier.
- `contact_person` (VARCHAR(100)): Name of the contact person at the supplier.
- `email` (VARCHAR(100), UNIQUE): Supplier's email address.
- `phone` (VARCHAR(20)): Supplier's contact phone number.
- `address` (TEXT): Supplier's physical address.
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Record creation timestamp.

**SQL Definition:**

```sql
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
```

---

### **5. Products**

**Purpose:** Stores detailed information about products available for sale.

**Fields:**

- `product_id` (SERIAL, PRIMARY KEY): Unique identifier for the product.
- `company_id` (INTEGER, NOT NULL, FOREIGN KEY): References `companies(company_id)`.
- `category_id` (INTEGER, FOREIGN KEY): References `categories(category_id)`.
- `supplier_id` (INTEGER, FOREIGN KEY): References `suppliers(supplier_id)`.
- `product_name` (VARCHAR(100), NOT NULL): Name of the product.
- `description` (TEXT): Description of the product.
- `sku` (VARCHAR(50), UNIQUE): Stock Keeping Unit identifier.
- `unit_price` (DECIMAL(10,2), NOT NULL): Price per unit.
- `tax_rate` (DECIMAL(4,2), DEFAULT 0.00): Applicable tax rate (%) for the product.
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Record creation timestamp.
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Record update timestamp.

**SQL Definition:**

```sql
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
```

**Notes:**

- **Supplier Association:** Linking products to suppliers facilitates efficient inventory and procurement management.
- **Tax Rate:** Enables calculation of taxes per product during sales transactions.

---

### **6. Customers**

**Purpose:** Manages customer information and registration details.

**Fields:**

- `customer_id` (SERIAL, PRIMARY KEY): Unique identifier for the customer.
- `company_id` (INTEGER, NOT NULL, FOREIGN KEY): References `companies(company_id)`.
- `first_name` (VARCHAR(50), NOT NULL): Customer's first name.
- `last_name` (VARCHAR(50), NOT NULL): Customer's last name.
- `email` (VARCHAR(100), UNIQUE): Customer's email address.
- `phone` (VARCHAR(20)): Customer's contact phone number.
- `address` (TEXT): Customer's physical address.
- `registered_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Registration timestamp.
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Record update timestamp.

**SQL Definition:**

```sql
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
```

**Notes:**

- **Customer Registration:** Facilitates tracking of customer preferences, purchase history, and loyalty programs.

---

### **7. Inventory**

**Purpose:** Tracks the stock levels of products for each company.

**Fields:**

- `inventory_id` (SERIAL, PRIMARY KEY): Unique identifier for the inventory record.
- `product_id` (INTEGER, NOT NULL, FOREIGN KEY): References `products(product_id)`.
- `company_id` (INTEGER, NOT NULL, FOREIGN KEY): References `companies(company_id)`.
- `quantity` (INTEGER, NOT NULL, DEFAULT 0): Current stock level.
- `reorder_level` (INTEGER, DEFAULT 0): Stock level at which reordering should be initiated.
- `last_updated` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Timestamp of the last update.

**SQL Definition:**

```sql
CREATE TABLE inventory (
    inventory_id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    company_id INTEGER NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0,
    reorder_level INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Notes:**

- **Stock Management:** Facilitates monitoring of inventory levels and automates reorder processes when stock falls below predefined thresholds.

---

### **8. Stock Movements**

**Purpose:** Logs all changes to inventory levels, providing an audit trail for stock additions, subtractions, and adjustments.

**Fields:**

- `movement_id` (SERIAL, PRIMARY KEY): Unique identifier for the stock movement.
- `inventory_id` (INTEGER, NOT NULL, FOREIGN KEY): References `inventory(inventory_id)`.
- `movement_type` (`MovementType`, NOT NULL): Type of stock movement (`ADDITION`, `SUBTRACTION`, `ADJUSTMENT`).
- `quantity_change` (INTEGER, NOT NULL): Quantity change (positive for additions, negative for subtractions).
- `reference` (VARCHAR(100)): Reference to related entities (e.g., Sale ID, Purchase Order ID).
- `movement_date` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Timestamp of the movement.
- `performed_by` (INTEGER, FOREIGN KEY): References `users(user_id)`, indicating who performed the movement.

**SQL Definition:**

```sql
CREATE TABLE stock_movements (
    movement_id SERIAL PRIMARY KEY,
    inventory_id INTEGER NOT NULL REFERENCES inventory(inventory_id) ON DELETE CASCADE,
    movement_type MovementType NOT NULL,
    quantity_change INTEGER NOT NULL,
    reference VARCHAR(100), -- e.g., Sale ID, Purchase Order ID
    movement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    performed_by INTEGER REFERENCES users(user_id)
);
```

**Notes:**

- **Audit Trail:** Essential for tracking inventory discrepancies and ensuring accountability.
- **Reference Field:** Links movements to specific transactions or operations for context.

---

### **9. Purchase Orders**

**Purpose:** Manages orders placed to suppliers for restocking inventory.

**Fields:**

- `purchase_order_id` (SERIAL, PRIMARY KEY): Unique identifier for the purchase order.
- `company_id` (INTEGER, NOT NULL, FOREIGN KEY): References `companies(company_id)`.
- `supplier_id` (INTEGER, NOT NULL, FOREIGN KEY): References `suppliers(supplier_id)`.
- `order_date` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Date when the order was placed.
- `expected_delivery_date` (TIMESTAMP): Anticipated delivery date.
- `status` (`PurchaseOrderStatus`, DEFAULT 'PENDING'): Current status of the order (`PENDING`, `RECEIVED`, `CANCELED`).
- `total_amount` (DECIMAL(10,2), NOT NULL): Total cost of the purchase order.
- `created_by` (INTEGER, FOREIGN KEY): References `users(user_id)`, indicating who created the order.
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Timestamp of the last update.

**SQL Definition:**

```sql
CREATE TABLE purchase_orders (
    purchase_order_id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(supplier_id) ON DELETE SET NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expected_delivery_date TIMESTAMP,
    status PurchaseOrderStatus DEFAULT 'PENDING', -- e.g., PENDING, RECEIVED, CANCELED
    total_amount DECIMAL(10,2) NOT NULL,
    created_by INTEGER REFERENCES users(user_id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Notes:**

- **Order Tracking:** Facilitates monitoring of order statuses and managing supplier relationships.
- **Financial Oversight:** Helps in budgeting and financial planning based on procurement activities.

---

### **10. Purchase Order Items**

**Purpose:** Details the individual products included in each purchase order.

**Fields:**

- `purchase_order_item_id` (SERIAL, PRIMARY KEY): Unique identifier for the purchase order item.
- `purchase_order_id` (INTEGER, NOT NULL, FOREIGN KEY): References `purchase_orders(purchase_order_id)`.
- `product_id` (INTEGER, NOT NULL, FOREIGN KEY): References `products(product_id)`.
- `quantity` (INTEGER, NOT NULL): Quantity of the product ordered.
- `unit_price` (DECIMAL(10,2), NOT NULL): Price per unit of the product.
- `subtotal` (DECIMAL(10,2), NOT NULL): Total cost for the product (`quantity` × `unit_price`).

**SQL Definition:**

```sql
CREATE TABLE purchase_order_items (
    purchase_order_item_id SERIAL PRIMARY KEY,
    purchase_order_id INTEGER NOT NULL REFERENCES purchase_orders(purchase_order_id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);
```

**Notes:**

- **Financial Detail:** Enables precise tracking of expenditures per product.
- **Inventory Integration:** Facilitates automatic updates to inventory levels upon order receipt.

---

### **11. Sales**

**Purpose:** Records sales transactions made to customers.

**Fields:**

- `sale_id` (SERIAL, PRIMARY KEY): Unique identifier for the sale.
- `company_id` (INTEGER, NOT NULL, FOREIGN KEY): References `companies(company_id)`.
- `customer_id` (INTEGER, FOREIGN KEY): References `customers(customer_id)`.
- `user_id` (INTEGER, FOREIGN KEY): References `users(user_id)`, indicating who processed the sale.
- `sale_date` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Date and time of the sale.
- `subtotal` (DECIMAL(10,2), NOT NULL): Total amount before taxes.
- `tax_amount` (DECIMAL(10,2), DEFAULT 0.00): Total tax amount for the sale.
- `total_amount` (DECIMAL(10,2), NOT NULL): Total sale amount (`subtotal` + `tax_amount`).
- `status` (`SaleStatus`, DEFAULT 'COMPLETED'): Current status of the sale (`COMPLETED`, `REFUNDED`, `PENDING`).

**SQL Definition:**

```sql
CREATE TABLE sales (
    sale_id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    customer_id INTEGER REFERENCES customers(customer_id) ON DELETE SET NULL,
    user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    status SaleStatus DEFAULT 'COMPLETED' -- e.g., COMPLETED, REFUNDED, PENDING
);
```

**Notes:**

- **Financial Tracking:** Enables detailed analysis of sales performance and revenue.
- **Customer Insights:** Links sales to customers for loyalty programs and targeted marketing.

---

### **12. Sale Items**

**Purpose:** Details the individual products included in each sale.

**Fields:**

- `sale_item_id` (SERIAL, PRIMARY KEY): Unique identifier for the sale item.
- `sale_id` (INTEGER, NOT NULL, FOREIGN KEY): References `sales(sale_id)`.
- `product_id` (INTEGER, NOT NULL, FOREIGN KEY): References `products(product_id)`.
- `quantity` (INTEGER, NOT NULL): Quantity of the product sold.
- `unit_price` (DECIMAL(10,2), NOT NULL): Price per unit at the time of sale.
- `tax_amount` (DECIMAL(10,2), DEFAULT 0.00): Tax amount for the product.
- `subtotal` (DECIMAL(10,2), NOT NULL): Total cost for the product (`quantity` × `unit_price`).

**SQL Definition:**

```sql
CREATE TABLE sale_items (
    sale_item_id SERIAL PRIMARY KEY,
    sale_id INTEGER NOT NULL REFERENCES sales(sale_id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    subtotal DECIMAL(10,2) NOT NULL
);
```

**Notes:**

- **Inventory Management:** Linked to `stock_movements` for automatic inventory deductions upon sale.
- **Financial Detail:** Facilitates granular sales analysis per product.

---

### **13. Payments**

**Purpose:** Records payments made for sales transactions.

**Fields:**

- `payment_id` (SERIAL, PRIMARY KEY): Unique identifier for the payment.
- `sale_id` (INTEGER, NOT NULL, FOREIGN KEY): References `sales(sale_id)`.
- `payment_date` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Date and time of the payment.
- `amount` (DECIMAL(10,2), NOT NULL): Amount paid.
- `payment_method` (`PaymentMethod`, NOT NULL): Method used for the payment (`CASH`, `CREDIT_CARD`, etc.).
- `payment_reference` (VARCHAR(100)): Reference identifier for the payment (e.g., transaction ID).

**SQL Definition:**

```sql
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    sale_id INTEGER NOT NULL REFERENCES sales(sale_id) ON DELETE CASCADE,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(10,2) NOT NULL,
    payment_method PaymentMethod NOT NULL,
    payment_reference VARCHAR(100)
);
```

**Notes:**

- **Payment Tracking:** Enables reconciliation of sales and payments.
- **Reporting:** Facilitates analysis of payment method preferences and cash flow management.

---

### **14. Audit Logs**

**Purpose:** Monitors and records all changes (INSERT, UPDATE, DELETE) across the database tables for accountability and compliance.

**Fields:**

- `audit_id` (SERIAL, PRIMARY KEY): Unique identifier for the audit log entry.
- `table_name` (VARCHAR(50), NOT NULL): Name of the table where the operation occurred.
- `record_id` (INTEGER, NOT NULL): Identifier of the affected record.
- `operation` (Operation, NOT NULL): Type of operation (`INSERT`, `UPDATE`, `DELETE`).
- `changed_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Timestamp of the change.
- `changed_by` (INTEGER, FOREIGN KEY): References `users(user_id)`, indicating who made the change.
- `old_data` (JSONB): Data before the change (for `UPDATE` and `DELETE` operations).
- `new_data` (JSONB): Data after the change (for `INSERT` and `UPDATE` operations).

**SQL Definition:**

```sql
CREATE TABLE audit_logs (
    audit_id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER NOT NULL,
    operation Operation NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by INTEGER REFERENCES users(user_id),
    old_data JSONB,
    new_data JSONB
);
```

**Notes:**

- **Compliance:** Essential for regulatory compliance and internal audits.
- **Data Integrity:** Helps in tracking unauthorized or unintended data modifications.

---

## **Indexes**

Indexes are created to enhance query performance by allowing faster data retrieval. Below are the indexes established for various tables:

```sql
-- Users
CREATE INDEX idx_users_company ON users(company_id);
CREATE INDEX idx_users_role ON users(role);

-- Products
CREATE INDEX idx_products_company ON products(company_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_supplier ON products(supplier_id);

-- Inventory
CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_company ON inventory(company_id);

-- Stock Movements
CREATE INDEX idx_stock_movements_inventory ON stock_movements(inventory_id);

-- Purchase Orders
CREATE INDEX idx_purchase_orders_company ON purchase_orders(company_id);
CREATE INDEX idx_purchase_orders_supplier ON purchase_orders(supplier_id);

-- Purchase Order Items
CREATE INDEX idx_purchase_order_items_purchase_order ON purchase_order_items(purchase_order_id);
CREATE INDEX idx_purchase_order_items_product ON purchase_order_items(product_id);

-- Sales
CREATE INDEX idx_sales_company ON sales(company_id);
CREATE INDEX idx_sales_customer ON sales(customer_id);
CREATE INDEX idx_sales_user ON sales(user_id);

-- Sale Items
CREATE INDEX idx_sale_items_sale ON sale_items(sale_id);
CREATE INDEX idx_sale_items_product ON sale_items(product_id);

-- Payments
CREATE INDEX idx_payments_sale ON payments(sale_id);

-- Audit Logs
CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
```

**Notes:**

- **Performance Optimization:** Indexes are particularly beneficial for columns frequently used in `WHERE` clauses, joins, and orderings.
- **Maintenance Consideration:** While indexes improve read performance, they can slow down write operations (INSERT, UPDATE, DELETE). Balance indexing based on query patterns.

---

## **Constraints and Relationships**

Ensuring data integrity is paramount. The following constraints and relationships are enforced:

- **Primary Keys:** Uniquely identify each record in a table.
- **Foreign Keys:** Maintain referential integrity between tables, ensuring that relationships are consistent.
- **Unique Constraints:** Prevent duplicate entries for fields like `username`, `email`, and `sku`.
- **Check Constraints:** Enforce valid data values, such as limiting `movement_type` to specific ENUM values.
- **Not Null Constraints:** Ensure essential fields are always populated.

**Example:**

- **Users Table:**
  - `company_id` references `companies(company_id)`, ensuring each user is associated with a valid company.
  - `role` uses the `UserRole` ENUM, restricting roles to predefined values.

---

## **Security Considerations**

### **1. Password Management**

- **Hashing:** Store passwords as hashes using strong algorithms like bcrypt or Argon2.
- **Salting:** Apply unique salts to each password to prevent rainbow table attacks.
- **Never Store Plain Text:** Ensure that plain text passwords are never stored or logged.

### **2. Role-Based Access Control (RBAC)**

- **Enum-Based Roles:** Utilize the `UserRole` ENUM to assign specific roles to users.
- **Application-Level Enforcement:** Implement RBAC within the application to restrict access based on user roles.
- **Database-Level Permissions:** Optionally, leverage PostgreSQL's native role system for additional security layers.

### **3. Data Encryption**

- **At Rest:** Encrypt sensitive data stored in the database, especially fields like `password_hash`.
- **In Transit:** Use SSL/TLS to encrypt data transmitted between the application and the database.

### **4. Regular Audits and Monitoring**

- **Audit Logs:** Utilize the `audit_logs` table to monitor and review data changes.
- **Monitoring Tools:** Implement monitoring solutions to detect and alert on suspicious activities.

### **5. Principle of Least Privilege**

- **User Permissions:** Grant users only the permissions necessary to perform their roles.
- **Database Roles:** Define PostgreSQL roles with specific privileges and assign them to users as needed.

---

## **Sample Queries**

Below are examples of SQL queries to perform common operations within the POS system.

### **1. Retrieve All Products in a Specific Category**

```sql
SELECT p.product_id, p.product_name, p.unit_price, i.quantity, c.category_name
FROM products p
JOIN categories c ON p.category_id = c.category_id
JOIN inventory i ON p.product_id = i.product_id
WHERE c.category_name = 'BEVERAGES' AND i.company_id = 1;
```

### **2. Get Current Inventory Levels for All Products**

```sql
SELECT p.product_name, i.quantity, i.reorder_level
FROM inventory i
JOIN products p ON i.product_id = p.product_id
WHERE i.company_id = 1;
```

### **3. Insert a New Sale Transaction**

```sql
BEGIN;

-- Insert into sales table
INSERT INTO sales (company_id, customer_id, user_id, subtotal, tax_amount, total_amount, status)
VALUES (1, 10, 5, 100.00, 5.00, 105.00, 'COMPLETED')
RETURNING sale_id;

-- Assume sale_id is 20

-- Insert into sale_items table
INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, tax_amount, subtotal)
VALUES 
(20, 101, 2, 25.00, 1.25, 50.00),
(20, 102, 1, 50.00, 3.75, 50.00);

-- Insert into payments table
INSERT INTO payments (sale_id, amount, payment_method, payment_reference)
VALUES (20, 105.00, 'CREDIT_CARD', 'txn_ABC123');

-- Insert stock movements for each sale item
INSERT INTO stock_movements (inventory_id, movement_type, quantity_change, reference, performed_by)
SELECT i.inventory_id, 'SUBTRACTION', -si.quantity, 'SALE_' || s.sale_id, s.user_id
FROM sale_items si
JOIN inventory i ON si.product_id = i.product_id
JOIN sales s ON si.sale_id = s.sale_id
WHERE si.sale_id = 20;

COMMIT;
```

**Explanation:**

- **Transaction Management:** The entire operation is wrapped in a transaction to ensure atomicity.
- **Sales Insertion:** A new sale record is created.
- **Sale Items Insertion:** Multiple sale items are inserted linked to the sale.
- **Payments Insertion:** Payment details are recorded.
- **Stock Movements:** Inventory levels are updated based on the sale items.

### **4. Generate Sales Report for a Specific Period**

```sql
SELECT s.sale_id, s.sale_date, CONCAT(c.first_name, ' ', c.last_name) AS customer_name, s.total_amount
FROM sales s
LEFT JOIN customers c ON s.customer_id = c.customer_id
WHERE s.sale_date BETWEEN '2024-01-01' AND '2024-12-31'
ORDER BY s.sale_date DESC;
```

### **5. Identify Products Below Reorder Level**

```sql
SELECT p.product_id, p.product_name, i.quantity, i.reorder_level
FROM inventory i
JOIN products p ON i.product_id = p.product_id
WHERE i.quantity <= i.reorder_level AND i.company_id = 1;
```

---

## **Best Practices**

### **1. Regular Backups**

- **Frequency:** Schedule regular backups (daily, weekly) based on data criticality.
- **Storage:** Store backups securely, preferably in multiple locations.
- **Testing:** Periodically test backup restorations to ensure data integrity.

### **2. Index Maintenance**

- **Monitoring:** Regularly monitor index performance and usage.
- **Rebuilding:** Rebuild or reorganize indexes as needed to prevent fragmentation.

### **3. Data Validation**

- **Application-Level Checks:** Implement robust validation in the application to complement database constraints.
- **Sanitization:** Protect against SQL injection by sanitizing user inputs and using parameterized queries.

### **4. Scalability Planning**

- **Partitioning:** Consider table partitioning for large datasets like `sales` and `audit_logs`.
- **Sharding:** Plan for database sharding if expecting massive scale and distribution across multiple servers.

### **5. Documentation and Training**

- **Comprehensive Docs:** Maintain up-to-date documentation, including schema changes and query optimizations.
- **Training:** Ensure team members are trained on database usage, security protocols, and best practices.

### **6. Monitoring and Alerts**

- **Performance Metrics:** Monitor key performance indicators (KPIs) like query response times and transaction volumes.
- **Alert Systems:** Set up alerts for critical events such as failed transactions or unauthorized access attempts.

---

## **Future Enhancements**

### **1. Advanced Reporting and Analytics**

- **Business Intelligence Tools:** Integrate with BI tools like Tableau or Power BI for advanced analytics.
- **Data Warehousing:** Implement a data warehouse for historical data analysis and reporting.

### **2. Enhanced Security Features**

- **Two-Factor Authentication (2FA):** Add 2FA for user logins to bolster security.
- **Role Hierarchies:** Implement hierarchical roles for more granular permission management.

### **3. Integration with External Systems**

- **E-commerce Platforms:** Sync with online stores to manage inventory across channels.
- **Accounting Software:** Integrate with accounting systems like QuickBooks or Xero for streamlined financial management.

### **4. Mobile Accessibility**

- **Mobile App:** Develop a mobile application for on-the-go access to sales and inventory data.
- **Responsive Design:** Ensure the POS application is responsive and accessible on various devices.

### **5. Automation and AI**

- **Predictive Analytics:** Utilize AI to forecast sales trends and optimize inventory levels.
- **Automated Reordering:** Implement automated purchase order generation based on inventory forecasts.

---

## **Appendix**

### **SQL Scripts**

For quick reference, all SQL scripts related to table creation, ENUM definitions, and indexes are consolidated below.

#### **1. Enumerated Types**

```sql
-- Create ENUM type for user roles
CREATE TYPE UserRole AS ENUM (
    'ADMIN',
    'MANAGER',
    'CASHIER',
    'INVENTORY_CLERK',
    'ACCOUNTANT',
    'AUDITOR',
    'SUPPORT_STAFF',
    'MARKETING_MANAGER',
    'SUPPLIER'
);

-- Create ENUM type for payment methods
CREATE TYPE PaymentMethod AS ENUM (
    'CASH',
    'CREDIT_CARD',
    'DEBIT_CARD',
    'MOBILE_PAYMENT',
    'OTHER'
);

-- Create ENUM type for movement types
CREATE TYPE MovementType AS ENUM (
    'ADDITION',
    'SUBTRACTION',
    'ADJUSTMENT'
);

-- Create ENUM type for sale statuses
CREATE TYPE SaleStatus AS ENUM (
    'COMPLETED',
    'REFUNDED',
    'PENDING'
);

-- Create ENUM type for purchase order statuses
CREATE TYPE PurchaseOrderStatus AS ENUM (
    'PENDING',
    'RECEIVED',
    'CANCELED'
);

-- Create ENUM type for operations in audit logs
CREATE TYPE Operation AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE'
);
```

#### **2. Tables**

*Refer to the [Tables and Descriptions](#tables-and-descriptions) section for detailed SQL definitions.*

#### **3. Indexes**

```sql
-- Users
CREATE INDEX idx_users_company ON users(company_id);
CREATE INDEX idx_users_role ON users(role);

-- Products
CREATE INDEX idx_products_company ON products(company_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_supplier ON products(supplier_id);

-- Inventory
CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_company ON inventory(company_id);

-- Stock Movements
CREATE INDEX idx_stock_movements_inventory ON stock_movements(inventory_id);

-- Purchase Orders
CREATE INDEX idx_purchase_orders_company ON purchase_orders(company_id);
CREATE INDEX idx_purchase_orders_supplier ON purchase_orders(supplier_id);

-- Purchase Order Items
CREATE INDEX idx_purchase_order_items_purchase_order ON purchase_order_items(purchase_order_id);
CREATE INDEX idx_purchase_order_items_product ON purchase_order_items(product_id);

-- Sales
CREATE INDEX idx_sales_company ON sales(company_id);
CREATE INDEX idx_sales_customer ON sales(customer_id);
CREATE INDEX idx_sales_user ON sales(user_id);

-- Sale Items
CREATE INDEX idx_sale_items_sale ON sale_items(sale_id);
CREATE INDEX idx_sale_items_product ON sale_items(product_id);

-- Payments
CREATE INDEX idx_payments_sale ON payments(sale_id);

-- Audit Logs
CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
```

---

### **Glossary**

- **POS (Point of Sale):** A system used by businesses to conduct sales transactions.
- **ENUM:** A data type in PostgreSQL that defines a static, ordered set of values.
- **Foreign Key (FK):** A field in a table that uniquely identifies a row in another table.
- **Primary Key (PK):** A unique identifier for a row within a table.
- **Audit Log:** A record of all changes and operations performed within the database.
- **RBAC (Role-Based Access Control):** A method of regulating access based on user roles.
- **SKU (Stock Keeping Unit):** A unique identifier for each distinct product and service.

---

## **Conclusion**

This documentation serves as a foundational guide for understanding and utilizing the POS system's PostgreSQL database. It outlines the structure, relationships, and functionalities necessary for efficient operation and management. Adhering to the best practices and considering future enhancements will ensure the system remains robust, secure, and scalable to meet evolving business needs.

For further assistance or inquiries, please refer to the development team or consult additional PostgreSQL resources.

---