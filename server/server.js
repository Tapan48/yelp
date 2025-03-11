require("dotenv").config();
const morgan = require("morgan"); ///third party middleware
const express = require("express");
const db = require("./db");
const cors = require("cors");
const app = express();

require("dotenv").config();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json()); /// this middleware helps in post/put requests,
/// the body in post requests gets stored in <req className="body"></req>

// app.use((req,res,next)=>{
// console.log("middleware1")
// next();
// });

// app.use((req,res,next)=>{
//   console.log("middleware2")
//   next();
//   });

app.get("/", (req, res) => {
  res.status(404).send("Hello World");
});

// Get all Restaurants
app.get("/api/v1/restaurants", async (req, res) => {
  try {
    console.log("retrieve restaurants list");
    //const results = await db.query("select * from restaurants");
    const restaurantRatingsData = await db.query(
      "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id;"
    );

    res.status(200).json({
      status: "success",
      results: restaurantRatingsData.rows.length,
      data: {
        restaurants: restaurantRatingsData.rows,
      },
    });
  } catch (err) {
    console.log("there is an error");
    console.log(err);
  }
});

// get a restaurant
app.get("/api/v1/restaurants/:id", async (req, res) => {
  console.log(req.params);

  try {
    // const results = await db.query(
    //   `select * from restaurants where id=${req.params.id}`
    // );  ///// prone to sql injection attack

    // console.log(results);
    // const restaurant = await db.query(
    //   "select * from restaurants where id=$1",[req.params.id]
    // );   ////  parametarized query : prevents from being vulnerable to sql injection <attacks></attacks>

    const restaurant = await db.query(
      "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id = $1",
      [req.params.id] ////  parametarized query : prevents from being vulnerable to sql injection <attacks></attacks>
    );

    const reviews = await db.query(
      "select * from reviews where restaurant_id = $1",
      [req.params.id]
    );

    res.status(200).json({
      status: "succes",
      data: {
        restaurant: restaurant.rows[0],
        reviews: reviews.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// create a restaurant
app.post("/api/v1/restaurants", async (req, res) => {
  // console.log(req.body);

  try {
    const results = await db.query(
      "INSERT INTO restaurants (name,location,price_range)values($1,$2,$3)returning *",
      [req.body.name, req.body.location, req.body.price_range]
    );

    console.log(results);
    res.status(201).json({
      status: "success",

      data: {
        restaurant: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

///update a restaurant
app.put("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const results = await db.query(
      "UPDATE  restaurants SET name=$1,location=$2,price_range=$3 where id=$4 returning *",
      [req.body.name, req.body.location, req.body.price_range, req.params.id]
    );

    res.status(200).json({
      status: "success",

      data: {
        restaurants: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
  console.log(req.params.id); ////   dynamic part of url
  console.log(req.body);
});

/// delete a restaurant

app.delete("/api/v1/restaurants/:id", (req, res) => {
  try {
    const results = db.query("DELETE FROM restaurants where id=$1", [
      req.params.id,
    ]);

    res.status(204).json({
      status: "success",
    });
  } catch (err) {
    console.log(err);
  }
  // console.log(req.body);
});

/// add a review
app.post("/api/v1/restaurants/:id/addReview", async (req, res) => {
  try {
    const newReview = await db.query(
      "INSERT INTO reviews (restaurant_id, name, review, rating) values ($1, $2, $3, $4) returning *;",
      [req.params.id, req.body.name, req.body.review, req.body.rating]
    );
    console.log(newReview);
    res.status(201).json({
      status: "success",
      data: {
        review: newReview.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
