import http from 'http';

const testData = JSON.stringify({
  recipientSlug: "uef-design-gallery",
  senderName: "Test Order",
  senderEmail: "test@example.com",
  senderCompany: "ABC Corp",
  purpose: "order",
  content: "test content"
});

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/messages',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(testData)
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('POST Response:', res.statusCode, body));
});
req.write(testData);
req.end();
