async function testSearch() {
    const url = 'https://localhost:7022/api/Category/getall';
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // ignore self signed cert
    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log("Categories Result:", JSON.stringify(data.slice(0, 2), null, 2));
    } catch (e) {
        console.error(e);
    }
}

testSearch();
