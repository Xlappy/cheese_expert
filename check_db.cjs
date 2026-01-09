const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'backend', 'database.sqlite');
const db = new Database(dbPath);
const count = db.prepare('SELECT count(*) as count FROM cheeses').get();
console.log(`Database items count: ${count.count}`);

const first = db.prepare('SELECT * FROM cheeses LIMIT 1').get();
console.log('First item:', first ? first.name : 'NONE');
db.close();
