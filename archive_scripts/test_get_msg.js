import http from 'http';

const loginData = JSON.stringify({ email: "admin@uef.edu.vn", password: "password123" });

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const data = JSON.parse(body);
    
    const req2 = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/messages',
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + data.token,
      }
    }, res2 => {
      let body2 = '';
      res2.on('data', d => body2 += d);
      res2.on('end', () => console.log('GET Response:', res2.statusCode, body2));
    });
    req2.end();
  });
});

req.write(loginData);
req.end();
