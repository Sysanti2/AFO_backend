const {buildSchema} = require('graphql');

module.exports =  buildSchema(`
scalar Upload

type Post {
    _id:ID!
    titre:String!
    status:String!
    type: String!
    content:String!
    createdDate:String!
    cover:String!
}
input Postinput {
    titre:String!
    status:String!
    type: String!
    content:String!
    createdDate:String!
    cover:String!
}



type Category {
    _id: ID!
    label: String!
    picture: String!
  
}
type File {
    filename: String
    mimetype: String
    encoding: String
  }
  
input CategoryInput {
    label: String!
    picture: [Upload!]!
}
    type User {
        _id: ID!
        firstname: String!,
        lastname: String!,
        sexe: String!,
        birthday: String!,
        email:String!,
        password:String,
        token:String!,
        role:String!,
        profilePic:Upload,
        tokenExpiration: Int!
    }
    input UserInput {
        firstname: String!,
        lastname: String!,
        sexe: String!,
        birthday: String!,
        email:String!,
        password:String!,
        token:String!,
        role:String!,
        profilePic:String!
    }

    type Event {
        _id: ID!
        title: String!
        description : String!
        price: Float!
        date: String!
    }
     
    type Region {
        _id: ID! 
        label:  String!
    }

    input RegionInput{
        label: String!
    }

    type AuthData {
        userId : ID!
        token: String!
        tokenExpiration: Int!
    }

    input EventInput {
        title: String!
        description : String!
        price: Float!
        date: String!
    }

    type RootQuery {
        events:[Event!]!
        users:[User!]!
        login(email: String! ,password: String!): AuthData!
        categories(first: Int):[Category!]!
        getCategoryById( _id: ID!):[Category]
        regions(first:Int):[Region!]!
        posts(first:Int):[Post!]!
        getPostById( _id: ID!):[Post!]!
    }
    type RootMutation{
        creatEvent(eventInput: EventInput): Event
        creatUser(userInput: UserInput): User
        creatCategory(categoryInput:CategoryInput ):Category
        updateCategory(_id:ID!, categoryInput:CategoryInput):Category
        deleteCategory(_id:ID!):Category
        uploadFile(profilePic: [Upload!]!): File
        creatRegion(regionInput:RegionInput):Region
        updateRegion(_id:ID!,regionInput:RegionInput):Region
        deleteRegion(_id:ID!):Region
        creatPost(postInput:Postinput):Post
        updatePost(_id:ID!,postInput:Postinput):Post
        deletePost(_id:ID!):Post
    }

    schema {

    query: RootQuery
    mutation: RootMutation
    }

`);
