import { NavLink } from "react-router-dom";
import logo from "./assets/logo.png";
import "./sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <img src={logo} className="logo"></img>
        </li>
        <li>
          <i className="fas fa-home"></i>
          <a href="#">Tableau de bord</a>
        </li>
        <li>
          <i className="fas fa-cog"></i>
          <NavLink to={"/parametrage"}>Paramétrage</NavLink>
          {/* <a href="#">Paramétrage</a> */}
        </li>
        <li>
          <i className="fas fa-book"></i>
          <a href="#">Journal</a>
        </li>
        <li>
          <i className="fas fa-balance-scale"></i>
          <a href="#">Bilan</a>
        </li>
        <li>
          <i className="fas fa-calendar"></i>
          <a href="#">Fiche journalière</a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
