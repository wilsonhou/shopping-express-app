const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Initialise DB
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "test",
  database: "simpleapi",
});

db.connect(err => {
  if (err) {
    console.error("Error connecting: " + err.stack);
  }
  console.log("connected as id: " + db.threadId);
});

db.query("DESCRIBE shoppinglist", (error, results, fields) => {
  if (error) throw error;

  console.log(fields.map(field => field.name));
  console.log(
    results.map(result => [
      result.Field,
      result.Type,
      result.Null,
      result.Key,
      result.Default,
      result.Extra,
    ])
  );
});

const server = {
  port: process.env.MYSQL_port || 4040,
};

// Handlers
const port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
  console.log(`Yo whatupppp, listening on port ${port}`);
});

app.get("/", (req, res) => {
  res.send({
    message: "yo what upp",
  });
});

app.get("/api/shoppinglist", (req, res) => {
  let sql = `SELECT * FROM shoppinglist`;
  db.query(sql, (err, results, fields) => {
    console.log("queried.");
    if (err) throw err;

    res.send({
      status: 200,
      data: {
        fields: fields.map(f => f.name),
        results,
      },
      message: "Good query!",
    });
  });
});
