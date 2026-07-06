// No imports needed

async function runTests() {
  const API_BASE = 'http://localhost:5000/api';
  
  // 1. Get an existing artwork to report
  let artworkId = null;
  try {
    const res = await fetch(`${API_BASE}/artworks`);
    const data = await res.json();
    if (data.artworks && data.artworks.length > 0) {
      // Find an artwork that is public
      const target = data.artworks.find(a => a.isPublic);
      if (!target) {
        console.error('[ERROR] No public artworks found to test.');
        return;
      }
      artworkId = target.id;
      console.log(`[TEST] Using Artwork ID: ${artworkId} (${target.title})`);
    } else {
      console.error('[ERROR] No artworks found in database to test.');
      return;
    }
  } catch (err) {
    console.error('[ERROR] Failed to fetch artworks:', err.message);
    return;
  }

  // 2. Generate 10 test users and report the artwork
  let successCount = 0;
  for (let i = 1; i <= 10; i++) {
    const email = `test_reporter_${Date.now()}_${i}@test.com`;
    const password = "Password123!";
    
    // Register
    let token = null;
    let regData = null;
    try {
      const regRes = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName: `Test User ${i}`, role: "student" })
      });
      regData = await regRes.json();
      
      const loginRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const loginData = await loginRes.json();
      token = loginData.token;
    } catch (err) {
      console.error(`[ERROR] Failed to register user ${i}:`, err.message);
      continue;
    }

    if (!token) {
      console.error(`[ERROR] User ${i} registration failed (no token). Response:`, regData);
      continue;
    }

    // Report Artwork
    try {
      const repRes = await fetch(`${API_BASE}/artworks/${artworkId}/report`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ violationType: 'Spam', detail: 'Automated test report' })
      });
      
      if (repRes.ok) {
        successCount++;
        console.log(`[TEST] User ${i} reported successfully. (Total reports: ${successCount})`);
      } else {
        const errData = await repRes.json();
        console.error(`[ERROR] User ${i} report failed:`, errData.message);
      }
    } catch (err) {
      console.error(`[ERROR] User ${i} report request failed:`, err.message);
    }
  }

  // 3. Verify Auto-hide logic (Check artwork status)
  try {
    const checkRes = await fetch(`${API_BASE}/artworks/${artworkId}`);
    const checkData = await checkRes.json();
    console.log(`\n--- TEST RESULTS ---`);
    console.log(`Artwork isPending: ${checkData.isPending}`);
    console.log(`Artwork isPublic: ${checkData.isPublic}`);
    
    if (checkData.isPending === true && checkData.isPublic === false) {
      console.log('✅ AUTO-HIDE TEST PASSED: Artwork is successfully hidden after 10 reports.');
    } else {
      console.log('❌ AUTO-HIDE TEST FAILED: Artwork status did not change to hidden.');
    }
  } catch (err) {
    console.error('[ERROR] Failed to verify artwork status:', err.message);
  }
}

runTests();
