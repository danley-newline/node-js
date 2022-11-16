const pokemons = require("./mock-pokemon")

exports.success = (message, data) => {
    return {
        message: message,
        data: data
    }
}

exports.getUniqueId = (pokemons) => {
    const pokemonIds = pokemons.map(pokemon => pokemon.id)
    const maxId = pokemonIds.reduce((a,b) => Math.max(a,b))
    const UniqueId = maxId + 1;

    return UniqueId;
}