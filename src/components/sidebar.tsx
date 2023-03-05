import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import "./sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <NavLink to={"/tableau-de-bord"}>
            <img src={logo} className="logo"></img>
          </NavLink>
        </li>
        <li>
          <NavLink to={"/tableau-de-bord"}>
            <i className="fas fa-home"></i>Tableau de bord
          </NavLink>
        </li>
        <li>
          <NavLink to={"/parametrage"}>
            <i className="fas fa-cog"></i>Paramétrage
          </NavLink>
        </li>
        <li>
          <NavLink to={"/journal"}>
            <i className="fas fa-book"></i>Journal
          </NavLink>
        </li>
        <li>
          <NavLink to={"/bilan"}>
            <i className="fas fa-balance-scale"></i>Bilan
          </NavLink>
        </li>
        <li>
          <NavLink to={"/fiche-journalière"}>
            <i className="fas fa-calendar"></i>Fiche Journalière
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
