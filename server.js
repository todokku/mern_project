const express =require("express");
const mongoose =require("mongoose"); // Mongoose to interact with MONGODB database
const bodyParser =require("body-parser"); //To post request & get data from the body

const items = require("./route/api/items");

const app = express(); // initialise express to var app

//Bodyparser middleware
app.use(bodyParser.json());

//Database Config to bring in mongoDB/Mongoose
const db = require("./config/keys").mongoURI;

//Connect to Mongo
mongoose
.connect(db)
.then(()=> console.log("MongoDB is connected")) //shows in terminal to show we are connected
.catch(err => console.log(err));

app.use("./api/items", items);

const port = process.env.PORT || 5000  //because we may deloy to heroku (process.env.port)

app.listen(port, ()=> console.log(`Server started on port ${port}`));