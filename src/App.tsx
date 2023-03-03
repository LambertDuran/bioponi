import Sidebar from "./sidebar";
import "./App.css";

function App() {
  return (
    <div className="container">
      <Sidebar />
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
