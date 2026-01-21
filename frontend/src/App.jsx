import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Customer from "./Components/Customer";
import Provider from "./Components/Provider";
import Admin from "./Components/Admin";

export default function App() {
  return (
    <BrowserRouter>
      <div className="max-w-4xl mx-auto p-4">
        <nav className="flex gap-3 mb-6 flex-wrap">
          <Link className="btn" to="/customer">Customer</Link>
          <Link className="btn" to="/provider">Provider</Link>
          <Link className="btn" to="/admin">Admin</Link>
        </nav>

        <Routes>
          <Route path="/customer" element={<Customer />} />
          <Route path="/provider" element={<Provider />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
