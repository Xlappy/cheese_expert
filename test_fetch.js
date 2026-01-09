async function test() {
    try {
        const res = await fetch('http://127.0.0.1:3003/api/cheeses');
        const data = await res.json();
        console.log(`FETCHED_COUNT:${data.length}`);
        if (data.length > 0) console.log(`FIRST_NAME:${data[0].name}`);
    } catch (e) {
        console.log(`FETCH_ERROR:${e.message}`);
    }
}
test();
