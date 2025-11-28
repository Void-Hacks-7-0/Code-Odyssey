const http = require('http');

const data = JSON.stringify({
    amount: 123.45,
    merchant: "Test Merchant",
    currency: "USD",
    user_id: "test_user"
});

const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/transaction',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);

    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(data);
req.end();
