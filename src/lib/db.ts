import mysql from 'mysql2/promise';

const db = mysql.createPool({
    host: import.meta.env.VITE_DB_HOST,
    user: import.meta.env.VITE_DB_USER,
    password: import.meta.env.VITE_DB_PASSWORD,
    database: import.meta.env.VITE_DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

export default db;
