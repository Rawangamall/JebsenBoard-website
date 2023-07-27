const express= require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose=require("mongoose");
var bodyParser = require('body-parser')
require("dotenv").config({ path: "config.env" });

const LoginRoute = require("./Routes/LoginRoute");
const UserRoute = require("./Routes/UserRoute");
const ProductRoute = require("./Routes/ProductRoute");
const CategoryRoute = require("./Routes/CategoryRoute");

//server
const server = express();
let port=process.env.PORT||8080;

//db connection
const db = process.env.DATABASE

mongoose.set('strictQuery', true);  //warning
//mongoose.set('debug', true);
 mongoose.connect(db,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
 })
        .then(()=>{
            console.log("DB connected");
            server.listen(port,()=>{
                console.log("server is listenng.....",port);
            });
        })
        .catch(error=>{
            console.log("Db Problem "+error);
        })

//body parse
server.use(express.json());
server.use(express.urlencoded({extended:false}));
server.use(bodyParser.json())

//Routes 
server.use(LoginRoute)
server.use(UserRoute)
server.use(ProductRoute)
server.use(CategoryRoute)

//Not Found Middleware
server.use((request, response, next) => {
	response
		.status(404)
		.json({ message: `${request.originalUrl} not found on this server!` });
});

//Global error handeling Middleware
server.use((error, request, response, next) => {
	if (error.statusCode && error.statusCode !== 500) {
		// the specific status code from the AppError
		response.status(error.statusCode).json({ message: error.message });
	} else {
        response.status(500).json({ message: error + "" });
	}
});
