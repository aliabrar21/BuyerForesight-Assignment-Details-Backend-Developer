async function testApi() {
  const baseUrl = 'http://localhost:3000/users';
  let userId;

  try {
    console.log('--- 1. POST /users (Create User) ---');
    const res1 = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email: 'test@example.com', age: 30 })
    });
    const data1 = await res1.json();
    console.log(data1);
    userId = data1.data?.id;

    console.log('\n--- 2. GET /users (List Users) ---');
    const res2 = await fetch(baseUrl);
    const data2 = await res2.json();
    console.log(data2);

    console.log('\n--- 3. GET /users/:id (Get Single User) ---');
    if (userId) {
      const res3 = await fetch(`${baseUrl}/${userId}`);
      const data3 = await res3.json();
      console.log(data3);
    }

    console.log('\n--- 4. PUT /users/:id (Update User) ---');
    if (userId) {
      const res4 = await fetch(`${baseUrl}/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ age: 31 })
      });
      const data4 = await res4.json();
      console.log(data4);
    }

    console.log('\n--- 5. DELETE /users/:id (Delete User) ---');
    if (userId) {
      const res5 = await fetch(`${baseUrl}/${userId}`, {
        method: 'DELETE'
      });
      const data5 = await res5.json();
      console.log(data5);
    }

    console.log('\n--- 6. Test Validation Error ---');
    const res6 = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'A', email: 'invalid-email', age: -5 })
    });
    const data6 = await res6.json();
    console.log(data6);

    setTimeout(() => process.exit(0), 500);
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
}

testApi();
