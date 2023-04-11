import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { login } from "./api"; // Import your login API function

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      //   const response = await login(email, password);
      //   // Successful login, redirect to home page
      //   if (response.status === 200) {
      //     navigate("/");
      //   } else {
      //     setIsLoading(false);
      //     setError("Invalid email or password");
      //   }
    } catch (error) {
      setIsLoading(false);
      setError("Failed to log in. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
