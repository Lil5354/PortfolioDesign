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
      const badUsers = data.users.filter(u => !u.fullName || !u.email);
      console.log('Bad users:', badUsers.length);
      if (badUsers.length > 0) {
        console.log(badUsers);
      } else {
        console.log('All users have fullName and email');
      }
    } catch(e) {
      console.error(e);
    }
  });
}).end();
