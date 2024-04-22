const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const jsonFilePath = path.join(process.cwd(), "db.json");

router.get("/", (req, res, next) => {
  try {
    let { page, limit, search, type } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    let offset = limit * (page - 1);

    let currentData = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));
    let results = [];
    results = currentData.pokemons; 

    if (search) {
      if (!isNaN(parseInt(search))) {
        results = results.filter((pokemon) => pokemon.id === parseInt(search));
      } else {
        results = results.filter((pokemon) => pokemon.name.includes(search));
      }
    }

    if (type) {
      results = results.filter((pokemon) => pokemon.types.includes(type));
    }

    results = results.slice(offset, offset + limit);

    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
