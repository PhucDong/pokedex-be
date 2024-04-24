const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const jsonFilePath = path.join(process.cwd(), "db.json");

router.get("/", (req, res, next) => {
  try {
    let { page, limit, search, type } = req.query;
    let currentData = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));
    page = parseInt(page) || 1;
    limit = parseInt(limit) || currentData.pokemons.length;
    let offset = limit * (page - 1);

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

    let pokemonNames = [];

    results.map((pokemon) => pokemonNames.push(pokemon.name));

    results = [results.slice(offset, offset + limit), pokemonNames];

    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", (req, res, next) => {
  try {
    let { id: pokemonId } = req.params;
    pokemonId = parseInt(pokemonId);

    let currentData = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));
    let results = {};
    let currentPokemonIndex;
    currentPokemonIndex = currentData.pokemons.findIndex(
      (pokemon) => pokemon.id === pokemonId
    );

    if (currentPokemonIndex === 0) {
      results.prevPokemon =
        currentData.pokemons[currentData.pokemons.length - 1];
      results.currentPokemon = currentData.pokemons[currentPokemonIndex];
      results.nextPokemon = currentData.pokemons[currentPokemonIndex + 1];
    } else if (currentPokemonIndex === currentData.pokemons.length - 1) {
      results.prevPokemon =
        currentData.pokemons[currentData.pokemons.length - 2];
      results.currentPokemon = currentData.pokemons[currentPokemonIndex];
      results.nextPokemon = currentData.pokemons[0];
    } else {
      results.prevPokemon = currentData.pokemons[currentPokemonIndex - 1];
      results.currentPokemon = currentData.pokemons[currentPokemonIndex];
      results.nextPokemon = currentData.pokemons[currentPokemonIndex + 1];
    }

    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

router.post("/", (req, res, next) => {
  try {
    const { name, url, types } = req.body;
    let currentData = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));

    const id = currentData.pokemons.length + 1;

    if (!name || !url || !types || !id) {
      const exception = new Error(`Missing form information.`);
      exception.statusCode = 401;
      throw exception;
    }

    const newPokemon = {
      id: id,
      url,
      name: name.toLowerCase(),
      types,
    };

    currentData.pokemons.push(newPokemon);
    fs.writeFileSync("db.json", JSON.stringify(currentData));
    res.status(200).send(newPokemon);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
