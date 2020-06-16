const {buildSchema} = require('graphql');

module.exports =  buildSchema(`

type Category {
    _id: ID!
    label: String!
}
input CategoryInput {
    label: String!
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
        profilePic:String!,
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
        categories:[Category!]!
        getCategoryById( _id: ID!):[Category]
    }
    type RootMutation{
        creatEvent(eventInput: EventInput): Event
        creatUser(userInput: UserInput): User
        creatCategory(categoryInput:CategoryInput ):Category
        updateCategory(_id:ID!, categoryInput:CategoryInput):Category
        deleteCategory(_id:ID!):Category
    }

    schema {

    query: RootQuery
    mutation: RootMutation
    }

`);
