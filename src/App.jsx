import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import AdminDashboard from "./pages/Landing";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
