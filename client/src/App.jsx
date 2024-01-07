import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import RestaurantdetailPage from "./routes/RestaurantdetailPage";
import UpdatePage from "./routes/UpdatePage";
import { RestaurantsContextProvider } from "./context/RestaurantsContext";
import Restaurantlist from "./components/restaurantlist";
function App() {
  return (
    <RestaurantsContextProvider>
    <div className="container">


      <Router>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/restaurants/:id" element={<RestaurantdetailPage />} />
          <Route path="/restaurants/:id/update" element={<UpdatePage />} />
        </Routes>
      </Router>
  
    </div>
    </RestaurantsContextProvider>
  );
}

export default App;
