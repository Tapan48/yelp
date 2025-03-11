import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { RestaurantsContextProvider } from "./context/RestaurantsContext";
import Home from "./routes/Home";
import RestaurantdetailPage from "./routes/RestaurantdetailPage";
import UpdatePage from "./routes/UpdatePage";
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
