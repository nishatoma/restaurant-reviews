// we are going to connect to the database and start the servers
import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import RestaurantsDAO from "./api/dao/restaurantsDAO.js"
// configure dot env
dotenv.config()
// Connect to our mongo client
const MongoClient = mongodb.MongoClient

// to access env variable, use process.env
// if for whatever reason, we cannot find that
// PORT variable, use port 8000
const port = process.env.PORT || 8000

MongoClient.connect(
    process.env.RESTREVIEWS_DB_URI,
    {
        maxPoolSize: 50,
        wtimeoutMS: 250,
        useNewUrlParser: true}
).catch(err => {
    console.error(err.stack)
    process.exit(1)
}).then(async client => {
    // right after we connect to the DB,
    // right before we start our server
    // we are going to call inject DB
    // This is how we get our initital reference to the restaurants collections
    // in the DB.
    await RestaurantsDAO.injectDB(client)
    // app.listen() is how we start our web server
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    })
})