const https = require('https');

// Initialize a transaction — returns a checkout URL for the customer to pay
exports.initializeTransaction = (email, amount, reference) => {
  return new Promise((resolve, reject) => {
    const params = JSON.stringify({
      email,
      amount: amount * 100, // Paystack expects kobo, not naira
      reference,
      callback_url: process.env.FRONTEND_URL
        ? `${process.env.FRONTEND_URL}/payment-callback`
        : undefined
    });

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: '/transaction/initialize',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const request = https.request(options, (response) => {
      let data = '';
      response.on('data', (chunk) => { data += chunk; });
      response.on('end', () => resolve(JSON.parse(data)));
    });

    request.on('error', (error) => reject(error));
    request.write(params);
    request.end();
  });
};

// Verify a transaction — confirms whether payment actually succeeded
exports.verifyTransaction = (reference) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: `/transaction/verify/${reference}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    };

    const request = https.request(options, (response) => {
      let data = '';
      response.on('data', (chunk) => { data += chunk; });
      response.on('end', () => resolve(JSON.parse(data)));
    });

    request.on('error', (error) => reject(error));
    request.end();
  });
};
