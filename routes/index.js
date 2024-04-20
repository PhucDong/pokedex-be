const express = require("express");
const router = express.Router();
const fs = require("fs");
const csv = require("csvtojson");

// turn csv file's data into JSON data
// return that data to the front-end to render it
const getPokemons = async (req, res, next) => {
  let newData = await csv().fromFile("pokemon.csv");

  newData = newData.map((newPokemon) => {
    return {
      pokemonName: newPokemon.Name,
      pokemonType1: newPokemon.Type1,
      pokemonType2: newPokemon.Type2,
    };
  });

  let currentData = JSON.parse(fs.readFileSync("db.json"));
  // console.log(20, currentData);
  currentData.pokemons = newData;
  fs.writeFileSync("db.json", JSON.stringify(currentData));

  // res.send(JSON.stringify(currentData));
  res.sendFile("../db.json");
};

// getPokemons();

/* GET home page. */
router.get("/", getPokemons);

module.exports = router;
