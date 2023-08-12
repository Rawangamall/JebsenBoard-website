const Sequelize = require('sequelize');
const path=require("path"); 
require("dotenv").config({ path: "config.env" });

console.log(process.env.DB_USER)
const sequelize = new Sequelize( 
    "jimmy", "jimmy","Aa123456#",
 { 
  host: "nader-mo.tech",
  dialect: "mysql", 
});

module.exports = sequelize;
