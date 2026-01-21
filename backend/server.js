const express = require("express");
const cors = require("cors");
const app = express();

const routes = require("./routes");

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use("/api", routes);
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
