
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/products";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/orders" element={<OrderHistoryPage />} />
      <Route path="/orders/:orderId" element={<OrderTrackingPage />} />
    </Routes>
  );
}

export default App;

