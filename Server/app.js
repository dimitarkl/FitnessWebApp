const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.listen(7000, (err) => {
	if (err) {
		return console.log("Could not start service");
	}
	console.log(`Service started successfully on port 7000`);
});
