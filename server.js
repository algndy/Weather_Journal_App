const express = require('express');//Require Express to run server and routes

const bodyParser = require('body-parser');//Require Body-Parser to work with JSON and urlencoded data

const cors = require('cors');//Require Cors for cross origin allowance

const path = require('path');//Require Path for determine directory path for different OS

const qs = require('qs');//Require qs for more secure

const port = process.env.PORT || 3000;//Local port


const app = express();// Start up an instance of app

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


app.use(cors());// Cors for cross origin allowance


app.use(express.static(path.join(__dirname,'docs')));// Initialize the main project folder

// Setup Server
const server = app.listen(port,()=>{
    console.log('Server is Running...');
    console.log(`running on localhost:${port}`);
})

// Setup empty JS object to act as endpoint for all routes
let projectData = {};

//Get posted data from /all route
app.get('/all',(req,res)=>{
    res.send(projectData);
});

//Post data to projectData object(endpoint)
app.post('/',(req,res)=>{
    projectData = req.body;
    console.log(req.body);
    res.send(projectData);
});