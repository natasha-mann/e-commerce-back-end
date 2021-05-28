const express = require("express");
const routes = require("./routes");
// import sequelize connection
const connection = require("./config/connection");
const { init } = require("./models/Product");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// sync sequelize models to the database, then turn on the server

const start = async () => {
  try {
    await connection.sync();
    app.listen(PORT, () => {
      console.log(`Navigate to http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(`Connection to DB failed: ${err.message}`);
  }
};

start();
