import auth from "../services/auth";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import "./sidebar.css";

const paths = [
  "/parametrage",
  "/journal",
  "/bassins",
  "/bilan",
  "/fiche-journaliere",
];
const icons = [
  "fas fa-cog",
  "fas fa-book",
  "fas fa-database",
  "fas fa-chart-line",
  "fas fa-calendar",
];
const names = [
  "Paramétrage",
  "Journal",
  "Bassins",
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
    <li className={`${isActive ? "active" : "inactive"}_item`}>
      <NavLink to={path} onClick={onClick}>
        <i className={icon}></i>
        {name}
      </NavLink>
    </li>
  );
};

const Sidebar = () => {
  const activePath = useLocation().pathname;
  const [activeIndex, setActiveIndex] = useState(
    paths.findIndex((path) => path === activePath)
  );
  const [sidebarStyle, setSidebarStyle] = useState("sidebar");

  const user: any = auth.getCurrentUser();

  return (
    <div onBlur={() => setSidebarStyle("sidebar")}>
      <i
        className="fas fa-bars hamburger"
        onClick={() => setSidebarStyle("sidebar_show")}
      ></i>
      <div className={sidebarStyle}>
        <ul>
          <li>
            <NavLink to={"/parametrage"}>
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
                setSidebarStyle("sidebar");
                setActiveIndex(index);
              }}
              isActive={activeIndex === index}
            />
          ))}
          <div className="sidebar_name">
            <li style={{ marginLeft: "10px" }}>
              <i className="fas fa-user"></i>
              {user.name}
            </li>
            {user.isAdmin && (
              <li style={{ marginLeft: "10px" }}>
                <i className="fas fa-lock"></i>
                Administrateur
              </li>
            )}
            <li>
              <NavLink
                className="sidebar_disconnect"
                to={"/"}
                onClick={() => auth.removeToken()}
              >
                <i className="fas fa-arrow-right"></i>
                Déconnexion
              </NavLink>
            </li>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
