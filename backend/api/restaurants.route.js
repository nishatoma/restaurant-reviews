import express from "express"
import RestaurantCtrl from "./restaurants.controller.js"
// this is our route file,
// we will be creating the routes people will go to
const router = express.Router()

// just a sample,
// if we go to the route URL, we should get a response of "hello world!"
// The controller file will be what the router uses
// Now instead of sending (req, res) => res.send("Hello, World!")
// we will use Restaurants Controller to get restaurants in our base API url
router.route("/").get(RestaurantCtrl.apiGetRestaurants)



// Now we can use our router outside!
export default router