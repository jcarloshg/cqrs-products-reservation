import * as fs from 'fs';
import * as path from 'path';

// ─────────────────────────────────────
// ─────────────────────────────────────
// users
// ─────────────────────────────────────
// ─────────────────────────────────────
const usersPath = path.join(__dirname, 'users.json');
console.log(`usersPath: ${usersPath}`);
const usersData = fs.readFileSync(usersPath, 'utf-8');
const users = JSON.parse(usersData) as any[];

const usersSqlInsertValuesInitial = `INSERT INTO users (uuid, username, password) VALUES `;
const usersSqlInsertValues = users.map(user => `('${user.uuid}', '${user.username}', '${user.password}')`).join(', \n');
const usersSqlInsert = usersSqlInsertValuesInitial + usersSqlInsertValues + ';';

// ─────────────────────────────────────
// ─────────────────────────────────────
// products
// ─────────────────────────────────────
// ─────────────────────────────────────
const productsPath = path.join(__dirname, 'products.json');
console.log(`productsPath: ${productsPath}`);
const productsData = fs.readFileSync(productsPath, 'utf-8');
const products = JSON.parse(productsData) as any[]
products.forEach(product => {
    if (typeof product.name === 'string') {
        product.name = product.name.replace(/'/g, "''");
    }
    if (typeof product.description === 'string') {
        product.description = product.description.replace(/'/g, "''");
    }
});

const productsSqlInsertValuesInitial = `INSERT INTO products (uuid, name, description, price) VALUES `;
const productsSqlInsertValues = products.map(product => `('${product.uuid}', '${product.name}', '${product.description}', ${product.price})`).join(', \n');
const productsSqlInsert = productsSqlInsertValuesInitial + productsSqlInsertValues + ';';


// ─────────────────────────────────────
// ─────────────────────────────────────
// stock
// ─────────────────────────────────────
// ─────────────────────────────────────
const stockPath = path.join(__dirname, 'stock.json');
console.log(`stockPath: ${stockPath}`);
const stockData = fs.readFileSync(stockPath, 'utf-8');
const stock = JSON.parse(stockData) as any[];

const stockSqlInsertValuesInitial = `INSERT INTO stock (uuid, product_uuid, available_quantity, reserved_quantity) VALUES `;
const stockSqlInsertValues = stock.map(item => `('${item.uuid}', '${item.product_uuid}', ${item.available_quantity}, ${item.reserved_quantity})`).join(', \n');
const stockSqlInsert = stockSqlInsertValuesInitial + stockSqlInsertValues + ';';

// ─────────────────────────────────────
// ─────────────────────────────────────
// create the complete script sql
// ─────────────────────────────────────
// ─────────────────────────────────────

const scriptSql = `
-- ─────────────────────────────────────
-- users
-- ─────────────────────────────────────
${usersSqlInsert}

-- ─────────────────────────────────────
-- products
-- ─────────────────────────────────────
${productsSqlInsert}

-- ─────────────────────────────────────
-- stock
-- ─────────────────────────────────────
${stockSqlInsert}
`;

const outputPath = path.join(__dirname, '02.insert-data.sql');
fs.writeFileSync(outputPath, scriptSql);
