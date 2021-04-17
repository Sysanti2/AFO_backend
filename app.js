
const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp  = require('express-graphql');
const  graphqlUploadExpress =  require('graphql-upload/public/graphqlUploadExpress');
const mongoose = require('mongoose');
const AppSchema = require('./GraphQl/schema/index');
const isAuth =  require('./middleware/isAuth');
const { createWriteStream } = require("fs");
const graphqlRootQuerry =  require('./GraphQl/Resolver/index');

const app = express();

const storeUpload = ({ stream, filename }) =>

  new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(filename),console.log('error'),)
      .on("finish", () => resolve())
      .on("error", console.log('error'), reject)
      
  );

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

app.use('/graphql',  
graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
graphqlHttp({
schema: AppSchema,

rootValue : graphqlRootQuerry,
graphiql: true,
}));

 mongoose.connect(
    `mongodb+srv://${
        process.env.MONGO_USER}:${process.env.MONGO_PASSWORD
        }@allforone-nr1wz.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
        ,{ useUnifiedTopology: true ,useNewUrlParser: true, useFindAndModify: false}).then().catch(err=>{
             console.log(err);   
        });
        
      



app.listen(4000);
