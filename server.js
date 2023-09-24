// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");

require('dotenv').config();
const app = express();



app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "test",
});


const port = process.env.PORT || 3300;

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err);
    return;
  }
  console.log("Connected to MySQL");
});
/////////////////////////////////////////

app.post("/product", (req, res) => {
  const { name, description, price } = req.body;

  const insertQuery = `INSERT INTO product (name, description, price) VALUES (?, ?, ?)`;
  db.query(insertQuery, [name, description, price], (err, result) => {
    if (err) {
      console.error("Error creating product: " + err);
      res.status(500).json({ error: "Unable to create product" });
    } else {
      res.status(201).json({ message: "Product created successfully" });
    }
  });
});

app.get("/product", (req, res) => {
  const selectQuery = `SELECT * FROM product`;
  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error("Error retrieving product: " + err);
      res.status(500).json({ error: "Unable to retrieve product" });
    } else {
      res.status(200).json(results);
    }
  });
});

app.get("/product/:id", (req, res) => {
  const productId = req.params.id;

  const selectQuery = `SELECT * FROM product WHERE id = ?`;
  db.query(selectQuery, [productId], (err, result) => {
    if (err) {
      console.error("Error retrieving product: " + err);
      res.status(500).json({ error: "Unable to retrieve product" });
    } else {
      if (result.length === 0) {
        res.status(404).json({ error: "Product not found" });
      } else {
        res.status(200).json(result[0]);
      }
    }
  });
});

app.put("/product/:id", (req, res) => {
  const productId = req.params.id;
  const { name, description, price } = req.body;

  const updateQuery = `UPDATE product SET name = ?, description = ?, price = ? WHERE id = ?`;
  db.query(
    updateQuery,
    [name, description, price, productId],
    (err, result) => {
      if (err) {
        console.error("Error updating product: " + err);
        res.status(500).json({ error: "Unable to update product" });
      } else {
        res.status(200).json({ message: "Product updated successfully" });
      }
    }
  );
});

app.delete("/product/:id", (req, res) => {
  const productId = req.params.id;

  const deleteQuery = `DELETE FROM product WHERE id = ?`;
  db.query(deleteQuery, [productId], (err, result) => {
    if (err) {
      console.error("Error deleting product: " + err);
      res.status(500).json({ error: "Unable to delete product" });
    } else {
      res.status(200).json({ message: "Product deleted successfully" });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
