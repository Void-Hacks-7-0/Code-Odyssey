const http = require('http');

const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/latest?limit=10',
    method: 'GET'
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        const transactions = JSON.parse(data);
        const indianCities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow"];

        let allIndia = true;
        transactions.forEach(tx => {
            const city = tx.location.split(',')[0].trim();
            if (!indianCities.includes(city) && tx.location.includes(", IN")) {
                // It might be a valid Indian city but not in my short list check, but if country is IN it's good.
            } else if (!tx.location.includes(", IN")) {
                console.log(`FAILURE: Found non-Indian location: ${tx.location}`);
                allIndia = false;
            }
        });

        if (allIndia) {
            console.log("SUCCESS: All recent transactions are from India.");
        }
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.end();
