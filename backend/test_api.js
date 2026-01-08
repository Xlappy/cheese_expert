// Simple test script to verify API endpoints
const baseUrl = 'http://localhost:3003/api';

async function testAPI() {
    try {
        console.log('🧪 Testing Cheese Expert API...\n');

        // Test health endpoint
        const health = await fetch(`${baseUrl}/health`);
        const healthData = await health.json();
        console.log('✅ Health check:', healthData);

        // Test get all cheeses
        const cheeses = await fetch(`${baseUrl}/cheeses`);
        const cheeseData = await cheeses.json();
        console.log(`✅ Fetched ${cheeseData.length} cheeses`);

        // Test search
        const search = await fetch(`${baseUrl}/search?q=Брі`);
        const searchData = await search.json();
        console.log(`✅ Search results: ${searchData.length} items`);

        console.log('\n🎉 All tests passed!');
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testAPI();
