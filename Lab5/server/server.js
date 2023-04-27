const { ApolloServer, gql } = require("apollo-server")
const axios = require('axios');
const { v4: uuid } = require("uuid")

// Redis Client Connection
const redis = require('redis');
const client = redis.createClient();
(async () => {
  client.on('error', (err) => console.log('Redis Client Error', err));
  await client.connect();
})();


// Image helper function
const getImageURL = async (id) => {
  try {
    const { data } = await axios.get(`https://api.foursquare.com/v3/places/${id}/photos`, {headers: {Authorization: "fsq3kiFbdoFIX9v5yobBZ/Fwz2b8y9tMq1GnTbOJz3rpzfQ="}});
    if (data.length) {
      let image_url = data[0].prefix + "original" + data[0].suffix;
      return image_url;
    }
    else {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png'
    }
  } catch (e) {
    return e;
  }
};

const typeDefs = gql`

type Query {
  locationPosts(pageNum: Int): [Location]
  userPostedLocations: [Location]
  likedLocations: [Location]
}

type Location {
  id: ID!
  image: String!
  name: String!
  address: String
  userPosted: Boolean!
  liked: Boolean!
}

type Mutation {
  updateLocation(id: ID!, image: String, name: String, address: String, userPosted: Boolean, liked: Boolean): Location
  uploadLocation(image: String!, address: String, name: String): Location
  deleteLocation(id: ID!): Location
}

`;

const resolvers = {
  Query: {
    locationPosts: async (parent, args) => {
      const pageNum = args.pageNum;
      let limit = pageNum * 10;
      const { data } = await axios.get(`https://api.foursquare.com/v3/places/search?limit=${limit}`, {headers: {Authorization: "fsq3kiFbdoFIX9v5yobBZ/Fwz2b8y9tMq1GnTbOJz3rpzfQ="}});

      const locations = data.results.map((place) => ({
          id: place.fsq_id,
          image: getImageURL(place.fsq_id),
          name: place.name,
          address: place.location.address,
          userPosted: false,
          liked: false,
        }));

      let likedList = await client.lRange("Liked_Locations", 0, -1);
      let parsedLikedList = []
      likedList.forEach(element => {
        parsedLikedList.push(JSON.parse(element));
      });

      for(i=0; i < locations.length; i++){
        let matchedID = parsedLikedList.filter((element) => element.id == locations[i].id);
        if(matchedID[0]) locations[i].liked = true;
      }

      return locations;
    },
    likedLocations: async (_, args) => {
      let likedList = await client.lRange("Liked_Locations", 0, -1);
      let parsedLikedList = []
      likedList.forEach(element => {
        parsedLikedList.push(JSON.parse(element));
      });
      return parsedLikedList;
    },
    userPostedLocations: async (_, args) => {
      let userLocationList = await client.lRange("User_Locations", 0, -1);
      let parsedUserList = []
      userLocationList.forEach(element => {
        parsedUserList.push(JSON.parse(element))
      });
      return parsedUserList;
    }
  },
  Mutation: {
    updateLocation: async (_, args) => {
      const {id, name, image, address, userPosted, liked} = args;
      let newUpdateLocation = {
        id: id,
        name: name,
        image: image,
        address: address,
        userPosted: userPosted,
        liked: liked
      };

      if(liked) {
        // Append to liked Location List
        await client.lPush("Liked_Locations", JSON.stringify(newUpdateLocation));

        // Make changes to the User Post list as well
        if (newUpdateLocation.userPosted){
          let userLocationList = await client.lRange("User_Locations", 0, -1);
          let parsedUserList = []
          userLocationList.forEach(element => {
            parsedUserList.push(JSON.parse(element))
          });
          let likedUserLocation = parsedUserList.filter((element) => element.id == id);
          client.lRem("User_Locations", 0, JSON.stringify(likedUserLocation[0]))
          //After delete append new object
          await client.lPush("User_Locations", JSON.stringify(newUpdateLocation));
        }
      } else {
        let likedList = await client.lRange("Liked_Locations", 0, -1);
        let parsedLikedList = []
        likedList.forEach(element => {
          parsedLikedList.push(JSON.parse(element));
        });
        let unlikedLocation = parsedLikedList.filter((element) => element.id == id);
        client.lRem("Liked_Locations", 0, JSON.stringify(unlikedLocation[0]))

        // Make changes to the User Post list as well
        if (newUpdateLocation.userPosted){
          let userLocationList = await client.lRange("User_Locations", 0, -1);
          let parsedUserList = []
          userLocationList.forEach(element => {
            parsedUserList.push(JSON.parse(element))
          });
          let unlikedUserLocation = parsedUserList.filter((element) => element.id == id);
          client.lRem("User_Locations", 0, JSON.stringify(unlikedUserLocation[0]))
          //After delete append new object
          await client.lPush("User_Locations", JSON.stringify(newUpdateLocation));
        }
      }

      return newUpdateLocation;
    },
    uploadLocation: async (_, args) => {
      const {name, image, address} = args;
      let newLocation = {
        id: uuid(),
        name: name,
        image: image,
        address: address,
        userPosted: true,
        liked: false
      }
      await client.lPush("User_Locations", JSON.stringify(newLocation));
      return newLocation;
    },
    deleteLocation: async (_, { id }) => {
      let userLocationList = await client.lRange("User_Locations", 0, -1);
      let parsedUserList = []
      userLocationList.forEach(element => {
        parsedUserList.push(JSON.parse(element))
      });
      let unlikedLocation = parsedUserList.filter((element) => element.id == id);
      client.lRem("User_Locations", 0, JSON.stringify(unlikedLocation[0]))
      userLocationList = await client.lRange("User_Locations", 0, -1);

      // ALso delete it from the liked list if it was liked user post
      let likedList = await client.lRange("Liked_Locations", 0, -1);
      let parsedLikedList = []
      likedList.forEach(element => {
        parsedLikedList.push(JSON.parse(element));
      });
      // Check the presence of the location in liked list
      let likedUserLocation = parsedLikedList.filter((element) => element.id == id);
      if(likedUserLocation[0]){
        client.lRem("Liked_Locations", 0, JSON.stringify(likedUserLocation[0]))
      }

      // Return new User Loaction List
      return unlikedLocation[0];
    }
  }
};

const server = new ApolloServer({ 
    typeDefs, 
    resolvers 
});

server.listen().then(({url})=>{
    console.log("🚀 Server is up at: 🚀 " + url)
});
