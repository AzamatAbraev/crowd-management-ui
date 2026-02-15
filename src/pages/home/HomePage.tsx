export function HomePage() {
  const handleLogout = () => {
    // 1. Clear any local storage/state if you have it
    localStorage.clear();

    // 2. Redirect to Gateway's default logout endpoint
    // This triggers the OidcClientInitiatedServerLogoutSuccessHandler
    window.location.href = "http://localhost:8082/logout";
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Home Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}