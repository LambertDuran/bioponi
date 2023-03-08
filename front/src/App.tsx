import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/sidebar";
import "./App.css";

function App() {
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
