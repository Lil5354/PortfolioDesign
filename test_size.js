import http from 'http';

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/admin/users?limit=20',
  method: 'GET'
}, res2 => {
  let length = 0;
  let start = Date.now();
  res2.on('data', d => length += d.length);
  res2.on('end', () => {
    console.log('Time:', Date.now() - start, 'ms');
    console.log('Size:', length, 'bytes');
  });
});
req.end();
