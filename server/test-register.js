(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testnode+ci@example.com',
        password: 'testPassword123',
        first_name: 'Node',
        last_name: 'Tester'
      })
    });

    const data = await res.text();
    console.log('STATUS', res.status);
    console.log('BODY', data);
  } catch (err) {
    console.error('ERROR', err.message);
  }
})();
