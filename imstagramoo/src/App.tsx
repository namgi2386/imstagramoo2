import { Route, Routes } from "react-router";
import "./App.css";
import Indexpage from "./pages/indexPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Indexpage />} />
      </Routes>
    </>
  );
}

export default App;
