
const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp  = require('express-graphql');
const {buildSchema} =  require('graphql');
const mongoose = require('mongoose');
const Event = require('./models/event')

const app = express();
app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
schema: buildSchema(`


    type Event {
        _id: ID!
        title: String!
        description : String!
        price: Float!
        date: String!
    }
    input EventInput {
        title: String!
        description : String!
        price: Float!
        date: String!
    }

    type RootQuery {
        events:[Event!]!
    }
    type RootMutation{
        creatEvent(eventInput: EventInput): Event
    }

    schema {

    query: RootQuery
    mutation: RootMutation
    }

`),

rootValue :{
    events: ()=> {
       return Event.find()
        .then(events => {
            return events.map(event => {
                return{ ...event._doc}
            })
        })
        .catch(err => {
            throw err ;
        })
    },
    creatEvent: (args)=> {
       const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date)
       })
       return  event 
        .save()
        .then(result => {
            console.log(result);
            return{ ...result._doc} 
        })
        .catch(err=> {
            console.log(err);
            throw err ;
        } );
        
    }
   
},
graphiql: true,
}));

 mongoose.connect(
    `mongodb+srv://${
        process.env.MONGO_USER}:${process.env.MONGO_PASSWORD
        }@allforone-nr1wz.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
        ,{ useUnifiedTopology: true ,useNewUrlParser: true}).then().catch(err=>{
             console.log(err);   
        });
        
      



app.listen(3000);
