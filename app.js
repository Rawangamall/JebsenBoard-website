const express= require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose=require("mongoose");
var bodyParser = require('body-parser')

// const AuthenticateMW=require("./Core/auth/AuthenticateMW");

//server
const server = express();
let port=process.env.PORT||8080;

//db connection
mongoose.set('strictQuery', true);  //warning
 mongoose.connect("mongodb+srv://rawangamaal21:iti@node.gvt5cis.mongodb.net/?retryWrites=true&w=majority")
        .then(()=>{
            console.log("DB connected");
            server.listen(port,()=>{
                console.log("server is listenng.....",port);
            });
        })
        .catch(error=>{
            console.log("Db Problem "+error);
        })

server.use(cors());
server.use(morgan('combined'))

//body parse
server.use(express.json());
server.use(express.urlencoded({extended:false}));
server.use(bodyParser.json())

//Routes 
// server.use(loginRoute);

// server.use(AuthenticateMW);


//Not Found Middleware
server.use((request,response,next)=>{
    response.status(404).json({message:"Not Found"})
})

//ERROR handeling Middleware
server.use((error,request,response,next)=>{
    response.status(500).json({message:error+""});
})
