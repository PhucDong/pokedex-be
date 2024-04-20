const fs = require("fs");
const csv = require("csvtojson");
const path = require("path");

// turn csv file's data into JSON data
// return that data to the front-end to render it
const createPokemonData = async () => {
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

createPokemonData();
