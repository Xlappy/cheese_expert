const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

function seedDatabase(db) {
    try {
        console.log('🌱 Starting database seeding...');

        // Create table with proper schema matching Cheese interface
        db.exec(`
      CREATE TABLE IF NOT EXISTS cheeses (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        milk TEXT NOT NULL,
        origin TEXT NOT NULL,
        region TEXT,
        aging_months INTEGER DEFAULT 0,
        intensity INTEGER DEFAULT 3,
        texture INTEGER DEFAULT 3,
        saltiness INTEGER DEFAULT 3,
        pungency INTEGER DEFAULT 3,
        flavor_profile TEXT,
        best_pairing TEXT,
        price_per_100g REAL DEFAULT 0
      )
    `);

        // Read raw data from constants.ts
        const rawDataPath = path.join(__dirname, 'raw_data.txt');
        let rawContent = fs.readFileSync(rawDataPath, 'utf8');

        // Efficiently extract the array content
        const arrayMatch = rawContent.match(/const INITIAL_CHEESES: Cheese\[\] = (\[[\s\S]*?\]);/);

        if (!arrayMatch) {
            throw new Error("Could not find INITIAL_CHEESES array in raw_data.txt");
        }

        let arrayString = arrayMatch[1];

        // Use Function to safely evaluate the array string (caution: only for trusted data)
        const getCheeses = new Function(`return ${arrayString}`);
        const cheeses = getCheeses();

        console.log(`📦 Parsed ${cheeses.length} cheese items to seed.`);

        // Prepare insert statement
        const insert = db.prepare(`
      INSERT OR REPLACE INTO cheeses (
        id, name, type, milk, origin, region, aging_months, intensity, 
        texture, saltiness, pungency, flavor_profile, best_pairing, price_per_100g
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        // Use transaction for better performance
        const insertMany = db.transaction((items) => {
            for (const item of items) {
                insert.run(
                    item.id,
                    item.name,
                    item.type,
                    item.milk,
                    item.origin,
                    item.region || '',
                    item.agingMonths || 0,
                    item.intensity || 3,
                    item.texture || 3,
                    item.saltiness || 3,
                    item.pungency || 3,
                    item.flavorProfile || '',
                    item.bestPairing || '',
                    item.pricePer100g || 0
                );
            }
        });

        insertMany(cheeses);

        console.log(`✅ Successfully seeded ${cheeses.length} cheese items!`);

        // Verify the data
        const count = db.prepare('SELECT count(*) as count FROM cheeses').get();
        console.log(`📊 Database now contains ${count.count} cheeses.`);

        return true;
    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        console.error(error.stack);
        return false;
    }
}

// Allow running directly: node seed.js
if (require.main === module) {
    const dbPath = path.join(__dirname, 'database.sqlite');
    const db = new Database(dbPath);
    seedDatabase(db);
    db.close();
}

module.exports = { seedDatabase };
