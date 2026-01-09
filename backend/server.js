const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');
const { seedDatabase } = require('./seed');

const app = express();
const port = 3003;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

function initializeDatabase() {
    try {
        // Check if table exists
        const tableCheck = db.prepare("SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='cheeses'").get();

        let needsSeeding = false;
        if (tableCheck.count === 0) {
            needsSeeding = true;
        } else {
            // Check if table is empty
            const rowCheck = db.prepare("SELECT count(*) as count FROM cheeses").get();
            if (rowCheck.count === 0) {
                needsSeeding = true;
            }
        }

        if (needsSeeding) {
            console.log('📦 Database empty or missing. Auto-seeding...');
            seedDatabase(db);
        } else {
            console.log('✅ Database already initialized.');
        }
    } catch (error) {
        console.error('❌ Database initialization error:', error.message);
        process.exit(1);
    }
}

// Run initialization
initializeDatabase();

// ==================== API ENDPOINTS ====================

// GET /api/cheeses - Get all cheeses
app.get('/api/cheeses', (req, res) => {
    console.log(`[${new Date().toISOString()}] GET /api/cheeses - Request from ${req.ip}`);
    try {
        const cheeses = db.prepare('SELECT * FROM cheeses').all();

        // Map snake_case to camelCase for the frontend
        const mapped = cheeses.map(item => ({
            id: item.id,
            name: item.name,
            type: item.type,
            milk: item.milk,
            origin: item.origin,
            region: item.region,
            agingMonths: item.aging_months,
            intensity: item.intensity,
            texture: item.texture,
            saltiness: item.saltiness,
            pungency: item.pungency,
            flavorProfile: item.flavor_profile,
            bestPairing: item.best_pairing,
            pricePer100g: item.price_per_100g
        }));

        res.json(mapped);
    } catch (error) {
        console.error('Error fetching cheeses:', error);
        res.status(500).json({ error: 'Failed to fetch cheeses', message: error.message });
    }
});

// GET /api/cheeses/:id - Get single cheese by ID
app.get('/api/cheeses/:id', (req, res) => {
    try {
        const cheese = db.prepare('SELECT * FROM cheeses WHERE id = ?').get(req.params.id);

        if (!cheese) {
            return res.status(404).json({ error: 'Cheese not found' });
        }

        const mapped = {
            id: cheese.id,
            name: cheese.name,
            type: cheese.type,
            milk: cheese.milk,
            origin: cheese.origin,
            region: cheese.region,
            agingMonths: cheese.aging_months,
            intensity: cheese.intensity,
            texture: cheese.texture,
            saltiness: cheese.saltiness,
            pungency: cheese.pungency,
            flavorProfile: cheese.flavor_profile,
            bestPairing: cheese.best_pairing,
            pricePer100g: cheese.price_per_100g
        };

        res.json(mapped);
    } catch (error) {
        console.error('Error fetching cheese:', error);
        res.status(500).json({ error: 'Failed to fetch cheese', message: error.message });
    }
});

// POST /api/cheeses - Add new cheese
app.post('/api/cheeses', (req, res) => {
    try {
        const { id, name, type, milk, origin, region, agingMonths, intensity, texture, saltiness, pungency, flavorProfile, bestPairing, pricePer100g } = req.body;

        // Validation
        if (!id || !name) {
            return res.status(400).json({ error: 'Missing required fields: id and name are required' });
        }

        const insert = db.prepare(`
      INSERT INTO cheeses (
        id, name, type, milk, origin, region, aging_months, intensity, 
        texture, saltiness, pungency, flavor_profile, best_pairing, price_per_100g
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const result = insert.run(
            id,
            name,
            type || 'Fresh',
            milk || 'Cow',
            origin || 'Ukrainian',
            region || '',
            agingMonths || 0,
            intensity || 3,
            texture || 3,
            saltiness || 3,
            pungency || 3,
            flavorProfile || '',
            bestPairing || '',
            pricePer100g || 0
        );

        res.status(201).json({ success: true, id, changes: result.changes });
    } catch (error) {
        console.error('Error adding cheese:', error);

        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Cheese with this ID already exists' });
        }

        res.status(500).json({ error: 'Failed to add cheese', message: error.message });
    }
});

// PUT /api/cheeses/:id - Update cheese
app.put('/api/cheeses/:id', (req, res) => {
    try {
        const { name, type, milk, origin, region, agingMonths, intensity, texture, saltiness, pungency, flavorProfile, bestPairing, pricePer100g } = req.body;

        // Check if cheese exists
        const existing = db.prepare('SELECT id FROM cheeses WHERE id = ?').get(req.params.id);
        if (!existing) {
            return res.status(404).json({ error: 'Cheese not found' });
        }

        const update = db.prepare(`
      UPDATE cheeses SET
        name = ?,
        type = ?,
        milk = ?,
        origin = ?,
        region = ?,
        aging_months = ?,
        intensity = ?,
        texture = ?,
        saltiness = ?,
        pungency = ?,
        flavor_profile = ?,
        best_pairing = ?,
        price_per_100g = ?
      WHERE id = ?
    `);

        const result = update.run(
            name,
            type,
            milk,
            origin,
            region,
            agingMonths,
            intensity,
            texture,
            saltiness,
            pungency,
            flavorProfile,
            bestPairing,
            pricePer100g,
            req.params.id
        );

        res.json({ success: true, changes: result.changes });
    } catch (error) {
        console.error('Error updating cheese:', error);
        res.status(500).json({ error: 'Failed to update cheese', message: error.message });
    }
});

// DELETE /api/cheeses/:id - Delete cheese
app.delete('/api/cheeses/:id', (req, res) => {
    try {
        const result = db.prepare('DELETE FROM cheeses WHERE id = ?').run(req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Cheese not found' });
        }

        res.json({ success: true, changes: result.changes });
    } catch (error) {
        console.error('Error deleting cheese:', error);
        res.status(500).json({ error: 'Failed to delete cheese', message: error.message });
    }
});

// GET /api/search - Search cheeses
app.get('/api/search', (req, res) => {
    try {
        const query = req.query.q || '';
        const searchTerm = `%${query}%`;

        const cheeses = db.prepare(`
      SELECT * FROM cheeses 
      WHERE name LIKE ? 
      OR flavor_profile LIKE ? 
      OR region LIKE ?
      OR type LIKE ?
    `).all(searchTerm, searchTerm, searchTerm, searchTerm);

        const mapped = cheeses.map(item => ({
            id: item.id,
            name: item.name,
            type: item.type,
            milk: item.milk,
            origin: item.origin,
            region: item.region,
            agingMonths: item.aging_months,
            intensity: item.intensity,
            texture: item.texture,
            saltiness: item.saltiness,
            pungency: item.pungency,
            flavorProfile: item.flavor_profile,
            bestPairing: item.best_pairing,
            pricePer100g: item.price_per_100g
        }));

        res.json(mapped);
    } catch (error) {
        console.error('Error searching cheeses:', error);
        res.status(500).json({ error: 'Search failed', message: error.message });
    }
});

// POST /api/seed - Manual database re-seeding (admin endpoint)
app.post('/api/seed', (req, res) => {
    try {
        seedDatabase(db);
        res.json({ success: true, message: 'Database re-seeded successfully' });
    } catch (error) {
        console.error('Error re-seeding:', error);
        res.status(500).json({ error: 'Re-seeding failed', message: error.message });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    try {
        const count = db.prepare('SELECT count(*) as count FROM cheeses').get();
        res.json({
            status: 'healthy',
            database: 'connected',
            cheeseCount: count.count,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            error: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// Start server
const HOST = '0.0.0.0';
app.listen(port, HOST, () => {
    console.log(`UNIQUE_SERVER_START: Fromagerie Server Active at http://${HOST}:${port}`);
    console.log(`📊 API endpoints available at http://${HOST}:${port}/api/cheeses`);
});
