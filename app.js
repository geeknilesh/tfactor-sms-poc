const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const Router = require("./routes/index");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.use(Router);
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
