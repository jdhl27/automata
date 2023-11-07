import logo from './logo.svg';
import './App.css';
// Colores para los nodos de los graficos
const colorNode = {
  border: "#000000",
  background: "#1e9254",
  hover: {
    border: "#000000",
    background: "#9cd7ff",
  },
  highlight: {
    border: "#000000",
    background: "#1e9254",
  },
};

const colorNodeReject = {
  border: "#000000",
  background: "#00c3f8",
  hover: {
    border: "#000000",
    background: "#9cd7ff",
  },
  highlight: {
    border: "#000000",
    background: "#00c3f8",
  },
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
