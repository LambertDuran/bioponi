import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import "./App.css";

function App() {
  return (
    <div className="container">
      <Sidebar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
