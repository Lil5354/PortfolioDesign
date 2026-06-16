import http from 'http';

http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/admin/users?limit=100',
  method: 'GET'
}, res2 => {
  let body2 = '';
  res2.on('data', d => body2 += d);
  res2.on('end', () => {
    try {
      const data = JSON.parse(body2);
      const admins = data.users.filter(u => u.role === 'admin');
      console.log('Admins:', admins.map(a => ({ email: a.email, role: a.role })));
    } catch(e) {
      console.error(e);
    }
  });
}).end();
