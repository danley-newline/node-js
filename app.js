const express = require('express')
const morgan = require("morgan")
const favicon = require("serve-favicon")
const bodyParser = require("body-parser")
const { Sequelize, DataTypes } = require('sequelize')
let pokemons = require('./mock-pokemon')
const { success, getUniqueId } = require('./helper.js')
const PokemonModel = require('./src/models/pokemon')


const app = express()
const port = 3000

const sequelize = new Sequelize(
    'pokedex',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mariadb',
        dialectOptions: {
            timezone : 'Etc/GMT-2'
        },
        logging: false
    }
)

sequelize.authenticate()
    .then(_  => console.log("La connexion a la base de données a bien été établie"))
    .catch(error => console.error(`Impossible de se connecter a la base de donnée ${error}`))

const Pokemon = PokemonModel(sequelize, DataTypes)

sequelize.sync({force: true})
    .then(_ => {
        console.log(`la base de donnée pokdex a bien ete synchronisé`)

        pokemons.map(pokemon => {
            
            Pokemon.create({
                name: pokemon.name,
                hp: pokemon.hp,
                cp: pokemon.cp,
                picture: pokemon.picture,
                types: pokemon.types.join()
            }).then(bulizarre => console.log(bulizarre.toJSON()))

        })

        
    })

app
 .use(favicon(__dirname + '/favicon.ico'))
 .use(morgan('dev'))
 .use(bodyParser.json())


app.get('/', (req,res) => res.send('Hello, Express 2! ✋ '))


app.get('/api/pokemons', (req,res) => {
    const message = 'la liste des pokemon a bien été retournée';

    res.json(success(message,pokemons));
})

//ON UTILISE LA LISTE DE POKEMON DANS  NOS POINT DE TERMINAISON
app.get('/api/pokemon/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemon = pokemons.find(pokemon => pokemon.id === id);
    const message = 'le pokemon à bien été trouvé'
    res.json(success(message,pokemon));
    }
)

app.post('/api/pokemons', (req,res) => {
    const id = getUniqueId(pokemons);
    const pokemonCreated = {...req.body, ...{id: id, created: new Date()}}
    pokemons.push(pokemonCreated);
    const message = `Le pokemon ${pokemonCreated.name} a bien été crée.`
    res.json(success(message, pokemonCreated))
})

app.put('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemonUpdated = {...req.body, id: id}
    pokemons = pokemons.map(pokemon => {
        return pokemon.id === id ? pokemonUpdated : pokemon
    })

    const message = `lE POKÉMON  ${pokemonUpdated.name} A BIEN ETE MODIFIÉ`
    res.json(success(message,pokemonUpdated))

})

app.delete('/api/pokemons/:id', (req,res) => {
    const id = parseInt(req.params.id);
    const pokemonDeleted = pokemons.find(pokemon => pokemon.id === id)
    pokemons.filter(pokemon => pokemon.id !== id)
    const message =`Le pokemon ${pokemonDeleted.name} a bien été supprimé`
    res.json(success(message, pokemonDeleted))
})



app.listen(port, () => console.log(`Notre application est demarré : http://localhost:${port}`))