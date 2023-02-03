const users = require('./users')
const recipes = require('./recipes')

const ConstructorMethod = (app) => {
    app.use('/', users);
    app.use('/recipes', recipes);

    app.use('*', (req, res) => {
        return res.status(404).json("Not Found");
    })
}

module.exports = ConstructorMethod;