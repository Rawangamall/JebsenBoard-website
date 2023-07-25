const express= require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose=require("mongoose");
var bodyParser = require('body-parser')
require("dotenv").config({ path: "config.env" });


//server
const server = express();
let port=process.env.PORT||8080;

//db connection
const db = process.env.DATABASE

 mongoose.set('strictQuery', true);  //warning
 mongoose.connect(db)
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
app.use((request, response, next) => {
	response
		.status(404)
		.json({ message: `${request.originalUrl} not found on this server!` });
});

//Global error handeling Middleware
app.use((error, request, response, next) => {
	if (error.statusCode && error.statusCode !== 500) {
		// the specific status code from the AppError
		response.status(error.statusCode).json({ message: error.message });
	} else {
        response.status(500).json({ message: error + "" });
	}
});
