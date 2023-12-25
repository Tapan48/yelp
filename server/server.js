require("dotenv").config();
const morgan = require("morgan"); ///third party middleware
const express = require("express");
const db = require("./db");
const app = express();

require("dotenv").config();
const port = process.env.PORT || 3001;

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

//get all restaurants
app.get("/api/v1/restaurants", async (req, res) => {
  try {
    const results = await db.query("select * from restaurants");
    console.log(results);
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        restaurants: results.rows,
      },
    });
  } catch (err) {
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


    const results = await db.query(
      "select * from restaurants where id=$1",[req.params.id]
    );   ////  parametarized query : prevents from being vulnerable to sql injection <attacks></attacks>

    console.log(results);
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        restaurants: results.rows,
      },
    });
  } 
  
  catch (err) {
    console.log(err);
  }
 
});

// create a restaurant
app.post("/api/v1/restaurants", async(req, res) => {
  console.log(req.body);


  try{
    const results = await db.query(
      "INSERT INTO restaurants (name,location,price_range)values($1,$2,$3)returning *",[req.body.name,req.body.location,req.body.price_range]
    );

    console.log(results);
    res.status(201).json({
      status: "success",
  
      data: {
        restaurants: results.rows,
      },
    });

  }

  catch(err){
    console.log(err)
  }
  
});

///update a restaurant
app.put("/api/v1/restaurants/:id", async(req, res) => {


  try{
    const results = await db.query(
      "UPDATE  restaurants SET name=$1,location=$2,price_range=$3 where id=$4 returning *",[req.body.name,req.body.location,req.body.price_range,req.params.id]
    );

    res.status(200).json({
      status: "success",
  
      data: {
        restaurants: results.rows[0],
      },
    });

  }

  catch(err){

    console.log(err)
  }
  console.log(req.params.id); ////   dynamic part of url
  console.log(req.body);
  
});

/// delete a restaurant

app.delete("/api/v1/restaurants/:id", (req, res) => {

  try{

const results=db.query("DELETE FROM restaurants where id=$1",[req.params.id])


res.status(204).json({
  status: "success",
});
  }

  catch(err){

    console.log(err);
  }
  // console.log(req.body);

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
