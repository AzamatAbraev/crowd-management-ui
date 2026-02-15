export function LoginPage() {
  const login = () => {
    window.location.href = "http://localhost:8082/oauth2/authorization/keycloak";
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to Crowd Management</h1>
      <button onClick={login}>Login via Gateway</button>
    </div>
  );
}