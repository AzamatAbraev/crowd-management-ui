export function HomePage() {
  const handleLogout = () => {
    // We create a hidden form to perform a POST request.
    // This is necessary because Spring Security's logout 
    // is protected against CSRF by default and prefers POST.
    const form = document.createElement('form');
    form.method = 'POST';
    // Use the absolute URL to ensure we hit the Gateway directly
    form.action = 'http://localhost:8082/logout';

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div style={{
      padding: "2rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "1rem"
    }}>
      <h1>Home Dashboard</h1>
      <p>Welcome! You are currently logged in via Keycloak.</p>

      <button
        onClick={handleLogout}
        style={{
          padding: "10px 20px",
          backgroundColor: "#d9534f",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Logout
      </button>
    </div>
  );
}