import express from "express"
import cors from "cors"
import restaurants from "./api/restaurants.route.js"

// Make the express app
const app = express()

// use our cors module
app.use(cors())
// use express.json, means our server can accept JSON in
// body of request!
app.use(express.json())
// base URL for our API
app.use("/api/v1/restaurants", restaurants)
// if someone goes to a route that does not exist
app.use("*", (req, res) => res.status(404).json({error: "not found"}))

export default app