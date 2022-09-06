import logo from './logo.svg';
import './App.css';
import { Link } from "react-router-dom";
import EmbeddedDashboard from './app/routes/EmbeddedDashboard';

function EdgraphApp() {
  return (
    <div>
      <h1>EdgraphApp</h1>
      <nav
        style={{
          color: '#777777',
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        
        <EmbeddedDashboard/>
      </nav>
    </div>
  );
}

export default EdgraphApp;
