// This variable will store the reference to our DB.
let restaurants

// We are going to export this class called RestaurantsDAO
export default class RestaurantsDAO {

    // We will have a few ASYNC methods

    // This is how we initially connect to our DB
    // We are gonna call this method as soon as the server starts.
    // So as soon as the server starts, we will get a reference to our
    // restaurants DB.
    static async injectDB(conn) {
        // If the reference already exists,
        // no need to get it! So just return in that case and exit our function.
        if (restaurants) {
            return
        }
        // Otherwise, try and connect to the database called 'restaurants'
        try {
            // Connect to our 'restaurants' collection!
            // The name of our DB is in the ENV variable called
            // RESTREVIEWS_NS which is 'sample_restaurants' DB.
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants")
        } catch (e) {
            console.error(`Unable to establish a collection handle in RestaurantsDAO: ${e}`)
        }
    }

    // This function will use a query to fetch
    // multiple restaurant objects from our restaurants collection
    static async getRestaurants({
        // These are options we can pass
        // to filter our the restaurants we actually want
        filters = null,
        page = 0,
        restaurantsPerPage = 20,
    } = {}) {
        // Initialize our query variable
        let query
        // If we passed some filters
        if (filters) {
            // We can search by name of the restaurant
            if ("name" in filters) {
                query = { $text: { $search: filters["name"]}}
            } else if ("cuisine" in filters) {
                // can search by cuisine
                query = { "cuisine": { $eq: filters["cuisine"]}}
            } else if ("zipcode" in filters) {
                // or by zipcode
                query = {"address.zipcode" : {$eq: filters["zipcode"]}}
            }
        }

        let cursor

        try {
            // Basically, if we don't specify a query,
            // return empty restaurants
            cursor = await restaurants
            .find(query)
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return {restaurantList : [], totalNumRestaurants: 0}
        }

        // If there is no error, then limit the results
        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)

        try {
            const restaurantList = await displayCursor.toArray();
            const totalNumRestaurants = await restaurants.countDocuments(query)

            return {restaurantList, totalNumRestaurants}
        } catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`)
            return {restaurantList : [], totalNumRestaurants: 0}
        }
    }
}