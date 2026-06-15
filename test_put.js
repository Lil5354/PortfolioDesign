import http from 'http';

const testData = JSON.stringify({ sortOrder: 1, isActive: true, content: { name: "Bà Nguyễn", role: "Giám đốc", type: "Doanh nghiệp", quote: "Đại diện...", avatar: "" } });

const req2 = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/site-section-items/test-item',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(testData)
  }
}, res2 => {
  let body2 = '';
  res2.on('data', d => body2 += d);
  res2.on('end', () => console.log('PUT Response:', res2.statusCode, body2));
});
req2.write(testData);
req2.end();
