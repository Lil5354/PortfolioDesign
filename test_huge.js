import http from 'http';

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/admin/users?limit=20',
  method: 'GET'
}, res2 => {
  let body = '';
  res2.on('data', d => body += d.toString());
  res2.on('end', () => {
    try {
      const data = JSON.parse(body);
      for (let i = 0; i < data.users.length; i++) {
        const u = data.users[i];
        if (JSON.stringify(u).length > 10000) {
          console.log(`HUGE User ${i}: ID=${u.id}, Size=${JSON.stringify(u).length}`);
          for (const key in u) {
            const size = JSON.stringify(u[key]).length;
            if (size > 10000) {
              console.log(`  Key ${key} is HUGE: ${size} bytes`);
            }
          }
        }
      }
    } catch(e) {
      console.error(e);
    }
  });
});
req.end();
