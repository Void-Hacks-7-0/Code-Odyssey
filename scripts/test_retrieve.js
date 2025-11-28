const http = require('http');

const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/latest?limit=200',
    method: 'GET'
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        if (data.includes("Test Merchant")) {
            console.log("SUCCESS: Found Test Merchant in history.");
        } else {
            console.log("FAILURE: Test Merchant NOT found in history.");
        }
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.end();
