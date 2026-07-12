import http from 'http';

const start = Date.now();
const req = http.request({
  hostname: '127.0.0.1',
  port: 5000,
  path: '/api/admin/users?limit=20',
  method: 'GET'
}, res2 => {
  let body = '';
  res2.on('data', d => body += d.toString());
  res2.on('end', () => {
    console.log('Time:', Date.now() - start, 'ms');
  });
});
req.end();
