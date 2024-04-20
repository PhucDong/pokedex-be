const express = require("express");
const router = express.Router();
const fs = require("fs");

// turn csv file's data into JSON data
// return that data to the front-end to render it
const getPokemons = async (req, res, next) => {
  try {
    let { page, limit, ...filterQuery } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    let offset = limit * (page - 1);

    let newData = await csv().fromFile("pokemon.csv");
    newData = newData.map((newPokemon) => {
      return {
        pokemonName: newPokemon.Name,
        pokemonType1: newPokemon.Type1,
        pokemonType2: newPokemon.Type2,
      };
    });
    // let currentData = JSON.parse(fs.readFileSync("db.json"));
    // currentData.pokemons = newData;
    // fs.writeFileSync("db.json", JSON.stringify(currentData));
    let results = [];
    results = newData;

    results = results.slice(offset, offset + limit);

    res.status(200).sennd(results);
  } catch (error) {
    next(error);
  }
};

router.get("/", getPokemons);

module.exports = router;