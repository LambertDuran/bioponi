//import React from "react";
import "./App.css";
import logo from "./assets/logo.png";

function App() {
  return (
    <div className="container">
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
            <a href="#">Paramétrage</a>
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
      <div className="content">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel
          ante ligula. Nulla facilisi. Pellentesque ac mauris varius, ultricies
          sapien id, pulvinar magna. Integer quis aliquet dolor, a porta mauris.
          Proin auctor, lacus sit amet fermentum lobortis, velit eros efficitur
          elit, vel rhoncus leo elit nec turpis. Aliquam erat volutpat.{" "}
        </p>
      </div>
    </div>
  );
}

export default App;
