import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Root from "./pages/home";
import Dashboard from "./pages/dashboard";
import Page404 from "./pages/404";
import Referral from "./pages/referral";
import OverView from "./pages/savings";
import Deposits from "./pages/deposit";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rewards" element={<Referral />} />
        <Route path="/overview" element={<OverView />} />
        <Route path="/deposit" element={<Deposits />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
