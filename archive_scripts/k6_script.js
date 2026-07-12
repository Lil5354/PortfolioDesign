import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50,          
  duration: '30s',  
};

export default function () {
  const res = http.get('http://localhost:5000/api/artworks/feed', {
    headers: { Authorization: `Bearer ${__ENV.TOKEN}` },
  });
  
  check(res, { 'status is 200 or 401': (r) => r.status === 200 || r.status === 401 });
  sleep(1);
}
