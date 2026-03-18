fetch("http://localhost:8000/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Test User",
    email: "test5@example.com",
    password: "password123",
  }),
})
  .then(res => res.json())
  .then(data => console.log("Response:", data))
  .catch(err => console.error(err));
