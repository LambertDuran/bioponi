import { NavLink } from "react-router-dom";
import logo from "./assets/logo.png";
import "./sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <img src={logo} className="logo"></img>
          <NavLink to={"/tableau-de-bord"} />
        </li>
        <li>
          <i className="fas fa-home"></i>
          <NavLink to={"/tableau-de-bord"}>Tableau de bord</NavLink>
        </li>
        <li>
          <i className="fas fa-cog"></i>
          <NavLink to={"/parametrage"}>Paramétrage</NavLink>
        </li>
        <li>
          <i className="fas fa-book"></i>
          <NavLink to={"/journal"}>Journal</NavLink>
        </li>
        <li>
          <i className="fas fa-balance-scale"></i>
          <NavLink to={"/bilan"}>Bilan</NavLink>
        </li>
        <li>
          <i className="fas fa-calendar"></i>
          <NavLink to={"/fiche-journalière"}>Fiche Journalière</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
