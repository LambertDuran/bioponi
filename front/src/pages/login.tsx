import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/button";
import loginLogo from "../assets/loginLogo.png";
import { login } from "../services/login";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setError(null);
    const error = await login(email, password);
    if (error) setError(error);
    else navigate("/parametrage");
  };

  return (
    <div className="login_container">
      <img alt="bioponi-logo" src={loginLogo} className="login_logo"></img>
      <form onSubmit={handleSubmit}>
        <div className="login_form_container">
          {error && <div className="login_error">{error}</div>}
          <div className="login_form_row">
            <div>Email:</div>
            <input
              type="email"
              id="email"
              className="login_input_control"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="login_form_row">
            <div>Mot de passe:</div>
            <input
              type="password"
              id="password"
              className="login_input_control"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div className="login_button">
            <Button title="Connexion" onClick={() => {}} color="blue">
              <i className="fas fa-arrow-right"></i>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
