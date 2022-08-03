const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const qs = require('qs');
const port = 3000;


const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.join(__dirname,'..','webPage')));

const server = app.listen(port,()=>{
    console.log('Server is Running...');
    console.log(`running on localhost:${port}`);
})


let projectData = {};

app.get('/all',(req,res)=>{
    res.send(projectData);
});

app.post('/',(req,res)=>{
    projectData = req.body;
    console.log(req.body);
    res.send(projectData);
});


