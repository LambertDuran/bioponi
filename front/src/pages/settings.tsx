import Button from "../components/button";

export default function Settings() {
  return (
    <div>
      <Button
        title="Nouvelle espèce"
        onClick={() => console.log("clicked")}
        children={<i className="fas fa-fish"></i>}
      ></Button>
    </div>
  );
}
