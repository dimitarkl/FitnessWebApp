const express = require("express");
const app = express();
const cors = require("cors");
const pool=require('./db')
app.use(express.json());
app.use(cors());
app.listen(7000, (err) => {
	if (err) {
		return console.log("Could not start service");
	}
	console.log(`Service started successfully on port 7000`);
});
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error executing query", err);
  } else {
    console.log("PostgreSQL Time:", res.rows[0]);
  }
});
