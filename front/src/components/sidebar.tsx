import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import "./sidebar.css";

const paths = [
  "/tableau-de-bord",
  "/parametrage",
  "/journal",
  "/bilan",
  "/fiche-journalière",
];
const icons = [
  "fas fa-home",
  "fas fa-cog",
  "fas fa-book",
  "fas fa-balance-scale",
  "fas fa-calendar",
];
const names = [
  "Tableau de bord",
  "Paramétrage",
  "Journal",
  "Bilan",
  "Fiche Journalière",
];

interface ISidebarItem {
  path: string;
  icon: string;
  name: string;
  onClick: () => void;
  isActive: boolean;
}

const SidebarItem = ({ path, icon, name, onClick, isActive }: ISidebarItem) => {
  return (
    <li className={`sidebar_${isActive ? "active" : "inactive"}`}>
      <NavLink to={path} onClick={onClick}>
        <i className={icon}></i>
        {name}
      </NavLink>
    </li>
  );
};

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(-1);
  return (
    <div className="sidebar">
      <ul>
        <li>
          <NavLink to={"/tableau-de-bord"}>
            <img alt="bioponi-logo" src={logo} className="logo"></img>
          </NavLink>
        </li>
        {paths.map((path, index) => (
          <SidebarItem
            path={path}
            icon={icons[index]}
            name={names[index]}
            key={index}
            onClick={() => {
              console.log(activeIndex);
              setActiveIndex(index);
            }}
            isActive={activeIndex === index}
          />
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
