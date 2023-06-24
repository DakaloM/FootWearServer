import mysql from 'mysql';

export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "dk970329",
    database: "social",
})