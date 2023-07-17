import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Root from "./pages/home";
import Dashboard from "./pages/dashboard";
// import Page404 from "./pages/404";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="*" element={<Page404 />} /> */}
        <Route path="*" element={<Root />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
