export function HomePage() {
  const handleLogout = () => {
    fetch('http://localhost:3000/logout', { mode: 'no-cors', credentials: 'include' }).catch(() => {});
    const form = document.createElement('form');
    form.method = 'POST';
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