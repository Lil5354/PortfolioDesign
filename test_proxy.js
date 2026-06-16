import http from 'http';

http.request({
  hostname: 'localhost',
  port: 5173,
  path: '/api/admin/users',
  method: 'GET'
}, res2 => {
  let body2 = '';
  res2.on('data', d => body2 += d);
  res2.on('end', () => {
    console.log('Proxy Status:', res2.statusCode);
    console.log('Proxy body:', body2.slice(0, 500));
  });
}).end();
