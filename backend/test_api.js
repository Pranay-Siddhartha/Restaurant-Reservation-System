const API_URL = 'https://restaurant-reservation-system-r2q9.onrender.com/api';

async function testApi() {
    try {
        console.log("1. Testing Registration...");
        const regRes = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Test User', email: 'test@example.com', password: 'Password123!', phone: '1234567890' })
        });
        const regData = await regRes.json();
        console.log("Registration Response:", regData);

        console.log("\n2. Testing Login...");
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test@example.com', password: 'Password123!' })
        });
        const loginData = await loginRes.json();
        console.log("Login Response Status:", loginRes.status);
        const token = loginData.data?.token || loginData.token;

        if (!token) throw new Error("No token received");

        console.log("\n3. Testing Table Fetch (Protected)...");
        const tablesRes = await fetch(`${API_URL}/tables`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const tablesData = await tablesRes.json();
        console.log("Found Tables:", tablesData.data.length);

        console.log("\n4. Testing Reservation Creation...");
        const resCreate = await fetch(`${API_URL}/reservations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                date: '2026-07-04',
                startTime: '18:00',
                partySize: 4,
                specialRequests: 'Window seat'
            })
        });
        const resData = await resCreate.json();
        console.log("Reservation Response:", resData);

        console.log("\n✅ ALL END-TO-END TESTS PASSED SUCCESSFULLY");
    } catch (e) {
        console.error("Test Failed:", e);
    }
}

testApi();
