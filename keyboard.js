const kb = require('./keyboard-buttons')

module.exports = {
    home:[
     [kb.home.films, kb.home.cinemas],
     [kb.home.favorite]
    ],
    films:[
        [kb.film.random, kb.film.triller],
        [kb.film.comedy, kb.film.action],
        [kb.back]
    ]

}