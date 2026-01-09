const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);
const count = db.prepare('SELECT count(*) as count FROM cheeses').get();
console.log(`Database items count: ${count.count}`);

const list = db.prepare('SELECT id, name, type FROM cheeses LIMIT 5').all();
console.log('Sample items:', JSON.stringify(list, null, 2));
db.close();
