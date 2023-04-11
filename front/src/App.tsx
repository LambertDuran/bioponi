import { ToastContainer } from "react-toastify";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Login from "./pages/login";
import "./App.css";

function App() {
  if (useLocation().pathname === "/") return <Login />;
  return (
    <div className="container">
      <ToastContainer />
      <Sidebar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
