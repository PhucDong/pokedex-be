const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const jsonFilePath = path.join(process.cwd(), "db.json");

// turn csv file's data into JSON data
// return that data to the front-end to render it
const createPokemonData = async (req, res, next) => {
  let pokemonImageFiles = fs.readdirSync("./public/images"); // return all files (name & its extension)
  const pokemonNames = pokemonImageFiles.map((item) => path.parse(item).name); // return only file names (file extensions are not included)

  pokemonImageFiles.forEach((file, index) => {
    fs.renameSync(
      `./public/images/${file}`,
      `./public/images/${pokemonNames[index]}.png`
    );
  });

  let newData = await csv().fromFile("pokemon.csv");
  newData = newData.filter((item) => pokemonNames.includes(item.Name));

  newData = newData.map((pokemon, index) => {
    return {
      id: index + 1,
      url: `/images/${pokemon.Name}.png`,
      name: pokemon.Name,
      types:
        pokemon.Type2 !== ""
          ? [pokemon.Type1.toLowerCase(), pokemon.Type2.toLowerCase()]
          : [pokemon.Type1.toLowerCase()],
    };
  });

  let currentData = JSON.parse(fs.readFileSync("db.json"));
  currentData.pokemons = newData;
  fs.writeFileSync("db.json", JSON.stringify(currentData));
};

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

    res.status(200).sennd(results);
  } catch (error) {
    next(error);
  }
};

createPokemonData();

router.get("/", getPokemons);

module.exports = router;
