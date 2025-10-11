CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Users table
CREATE TABLE users (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Create Products table
CREATE TABLE products (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL
);

-- Create Stock table
CREATE TABLE stock (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    product_uuid UUID NOT NULL,
    available_quantity INTEGER NOT NULL DEFAULT 0,
    reserved_quantity INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (product_uuid) REFERENCES products (uuid)
);

-- Create Reservations table
CREATE TABLE reservations (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_uuid UUID NOT NULL,
    product_id UUID NOT NULL,
    quantity INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (
        status IN (
            'PENDING',
            'CONFIRMED',
            'CANCELLED',
            'EXPIRED'
        )
    ),
    expires_at TIMESTAMP
    WITH
        TIME ZONE NOT NULL,
        FOREIGN KEY (user_uuid) REFERENCES users (uuid),
        FOREIGN KEY (product_id) REFERENCES products (uuid)
);