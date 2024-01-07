// import axios from "axios";

// export default axios.create({
//   baseURL: "http://localhost:3001/api/v1/restaurants",
// });


// RestaurantFinder.js
import axios from 'axios';

const RestaurantFinder = axios.create({
  baseURL: "http://localhost:3001/api/v1/restaurants",
});

export default RestaurantFinder;