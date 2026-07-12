import http from 'http';

const loginData = JSON.stringify({ email: 'admin@test.com', password: 'password123' }); // Try to guess admin

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
    console.log('Login Status:', res.statusCode);
    console.log('Login Body:', body);
    try {
      const token = JSON.parse(body).token;
      if (token) {
        // Fetch users
        http.request({
          hostname: 'localhost',
          port: 5000,
          path: '/api/admin/users',
          method: 'GET',
          headers: { 'Authorization': 'Bearer ' + token }
        }, res2 => {
          let body2 = '';
          res2.on('data', d => body2 += d);
          res2.on('end', () => {
            console.log('Users Status:', res2.statusCode);
            console.log('Users length:', body2.length);
          });
        }).end();
      }
    } catch(e) {}
  });
});
req.write(loginData);
req.end();
