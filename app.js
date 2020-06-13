
const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp  = require('express-graphql');
const {buildSchema} =  require('graphql');
const mongoose = require('mongoose');
const Event = require('./models/event');
const User = require('./models/user');
const AppSchema = require('./GraphQl/schema/index');
const bcrypt = require('bcryptjs');
const jwet = require('jsonwebtoken')
const isAuth =  require('./middleware/isAuth');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });
app.use(isAuth);

app.use('/graphql', graphqlHttp({
schema: AppSchema,

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

    users: ()=>{
            return User.find()
            .then(users=> {
                return users.map(user => {
                    return{ ...user._doc}
            })
        }).catch(err=> {
            throw err;
        })
    },
    creatUser: args => {
      return  User.findOne({email:args.userInput.email})
      .then(user=> {

        if (user){
             throw new Error('User exists already !')
        } 
        return  bcrypt.hash(args.userInput.password, 12)
       })
      
        .then(hashedpassword => {
            const user = new User({
                    firstname: args.userInput.firstname,
                    lastname: args.userInput.lastname,
                    sexe: args.userInput.sexe,
                    birthday: new Date(args.userInput.birthday),
                    email: args.userInput.email,
                    password: hashedpassword,
                    token: args.userInput.token,
                    role: args.userInput.role,
                    profilePic: args.userInput.profilePic,
        }) ;
        return  user.save() 
    })
       
         .then( result => {
             console.log(result);
             const token  =  jwet.sign({userId: result.id, email: result.email}, 'keepcoolandneverbesad' ,
         {expiresIn: '1h' }); 

        
             return{ ...result._doc,password:null ,token: token, tokenExpiration :1 ,_id:result.id} 
         })
        .catch(err => {
            throw err;
        })
    
         
     },
 
    creatEvent: args=> {
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
        
    },
    login: async ({email,password}) => {
        console.log(password);
        const user = await User.findOne({email:email})
        if(!user)
        {
            throw new  Error('user does not Exist!');
        }
        const isEqual =  await  bcrypt.compare(password, user.password);
        console.log(isEqual);
        if (!isEqual) 
        {
            throw new  Error('password or email Incorrect ');
        }
       const token  =  jwet.sign({userId: user.id, email: user.email}, 'keepcoolandneverbesad' ,
         {expiresIn: '1h' }); 

         return {userId: user.id ,token: token, tokenExpiration :1 }
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
        
      



app.listen(4000);
