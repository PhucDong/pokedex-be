const express = require("express");
const router = express.Router();
const fs = require("fs");
const csv = require("csvtojson");
const pokemonsRouter = require("./pokemons.api");

/* GET home page. */
router.get("/", (req, res) => {
  res.status(200).send("<h1>Welcome to Pokedex</h1>");
});

router.use("/pokemons", pokemonsRouter);

module.exports = router;
