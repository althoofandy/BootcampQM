import "./App.css";
import Product from "./components/Product";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/LoginPage";
import Register from "./components/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./components/HomePage";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/cart" element={<Product />}></Route>
            <Route path="/products" element={<Product />}></Route>
          </Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
