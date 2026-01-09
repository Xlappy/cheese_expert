const Database = require('/home/pcselo/Desktop/cheese_expert/backend/node_modules/better-sqlite3');
const path = require('path');
const dbPath = '/home/pcselo/Desktop/cheese_expert/backend/database.sqlite';
try {
    const db = new Database(dbPath);
    const count = db.prepare('SELECT count(*) as count FROM cheeses').get();
    console.log(`COUNT_RESULT:${count.count}`);
    db.close();
} catch (e) {
    console.log(`ERROR:${e.message}`);
}
