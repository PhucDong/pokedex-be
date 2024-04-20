const express = require("express");
const router = express.Router();
const fs = require("fs");
const csv = require("csvtojson");
const path = require("path");
const jsonFilePath = path.join(process.cwd(), "db.json");

const getPokemons = (req, res, next) => {
  try {
    let { page, limit, ...filterQuery } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    let offset = limit * (page - 1);

    let currentData = JSON.parse(fs.readFileSync(jsonFilePath));
    let results = [];
    results = currentData.pokemons;

    results = results.slice(offset, offset + limit);

    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
};

router.get("/", getPokemons);

module.exports = router;
