import React, { useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import RestaurantFinder from "../apis/RestaurantFinder";
import StarRating from "./StarRating";
import { RestaurantsContext } from "../context/RestaurantsContext";


const Restaurantlist = () => {
  const { restaurants, setRestaurants } = useContext(RestaurantsContext);
  let navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("retrieve restaurants list");
        const response = await RestaurantFinder.get("/");
        console.log(response);
        setRestaurants(response.data.data.restaurants);   /// list of restaurant  objects
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (e, id) => {
    console.log("delete clicked");
    e.stopPropagation();
    try {
      const response = await RestaurantFinder.delete(`/${id}`);
      setRestaurants(
        restaurants.filter((restaurant) => {
          return restaurant.id !== id;
        })
      );
    } catch (err) {
      console.log(err);
    }
  };
  const renderRating = (restaurant) => {
    if (!restaurant.count) {
      return <span className="text-warning">0 reviews</span>;
    }
    return (  
      <>
        <StarRating rating={restaurant.average_rating
} />
        <span className="text-warning ml-1">({restaurant.count})</span>
      </>
    );
  };

  const handleUpdate = (e, id) => {
    e.stopPropagation();
    navigate(`/restaurants/${id}/update`);
  };
  const handleRestaurantSelect = (id) => {
    navigate(`/restaurants/${id}`);
  };

  return (
    <div className="list-group">
      <table className="table table-hover table-dark">
        <thead>
          <tr className="bg-primary">
            <th scope="col">Restaurant</th>
            <th scope="col">Location</th>
            <th scope="col">Price Range</th>
            <th scope="col">Ratings</th>
            <th scope="col">Edit</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {restaurants && restaurants.map((restaurant) => (
            <tr
             onClick={() => handleRestaurantSelect(restaurant.id)}
             key={restaurant.id}>
              <td>{restaurant?.name || "N/A"}</td>
              <td>{restaurant?.location || "N/A"}</td>
              <td>{"$".repeat(restaurant?.price_range || 0)}</td>
              <td>{renderRating(restaurant)}</td>
              <td>
                <button
                  onClick={(e) => handleUpdate(e, restaurant.id)}
                  className="btn btn-warning"
                >
                  Update
                </button>
              </td>
              <td>
                <button
                  onClick={(e) => handleDelete(e, restaurant.id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Restaurantlist;
