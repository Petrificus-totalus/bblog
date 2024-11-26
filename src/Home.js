import "./Home.css";
import CoolMenu from "./components/coolMenu/coolmenu";

const menuData = [
  ["Account", "Expenses", "Chart"],
  ["Learn", "Algorithm", "h5c3", "Java", "React", "SQL", "Docker", "git"],
  ["Fun", "Jokes", "Swallow"],
];
function Home() {
  return (
    <div className="App">
      <div className="menu">
        <CoolMenu menuData={menuData} />
      </div>
    </div>
  );
}

export default Home;
