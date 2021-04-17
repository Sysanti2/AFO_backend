
const User = require('../../models/user');
const Category = require('../../models/category');
const Post = require('../../models/post');
const Region =require('../../models/region');
const bcrypt = require('bcryptjs');
const jwet = require('jsonwebtoken')
const path = require('path');
const { createWriteStream } = require("fs");



module.exports = {
   

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
     categories : (args)=>{
        let limit  = args.first || 100
        
        return Category.find().limit(limit)
        .then(categories=> {
            return categories.map(category => {
                return{ ...category._doc}
        })
    }).catch(err=> {
        throw err;
    })
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
    },
    // Categories
    creatCategory: async  args=> {
        console.log(args);
        const files = await  args.categoryInput.picture[0].file;  
        const { createReadStream, filename } =files
        await new Promise(res =>
            createReadStream()
              .pipe(createWriteStream(path.join(__dirname, "../../img/categories", args.categoryInput.label+`${path.extname(filename)}`)))
              .on("close", res)
          );
       const category = new Category({
        label: args.categoryInput.label,
        picture:"img/categories/" + args.categoryInput.label+path.extname(filename),
       })
       return  category 
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
    updateCategory: args=>{
       return  Category.findOneAndUpdate({_id:args._id},{label:args.categoryInput.label}, {new:true})
    },
    deleteCategory : args =>{
        return Category.findOneAndRemove({_id:args._id})
    },
    getCategoryById: (args)=>{
        console.log('getcat',args)
        return Category.find({_id:args._id})
    },
    // Region 
     regions : (args)=>{
        let limit  = args.first || 100
        
        return Region.find().limit(limit)
        .then(regions=> {
            return regions.map(region => {
                return{ ...region._doc}
        })
    }).catch(err=> {
        throw err;
    })
     },
     creatRegion : async args =>{
        const region = new Region({
            label: args.regionInput.label,
            
           })
           return  region 
            .save()
            .then(result => {
                
                return{ ...result._doc} 
            })
            .catch(err=> {
                console.log(err);
                throw err ;
            } );
     },
     updateRegion: args=>{
        return  Region.findOneAndUpdate({_id:args._id},{label:args.regionInput.label}, {new:true})
     },
     deleteRegion : args =>{
        return Region.findOneAndRemove({_id:args._id})
    },
    // post
     posts: args =>{
        let limit  = args.first || 100

        return Post.find().limit(limit)
        .then(posts=> {
            return posts.map(post => {
                return{ ...post._doc}
        })
    }).catch(err=> {
        throw err;
    })

     },
     creatPost:  args =>{
         console.log(args)
        const post = new Post({
           
                titre: args.postInput.titre,
                status: args.postInput.status,
                type: args.postInput.type,
                content: args.postInput.content,
                createdDate:new Date(),
                cover: args.postInput.cover
           })
           return  post 
            .save()
            .then(result => {
                
                return{ ...result._doc} 
            })
            .catch(err=> {
                console.log(err);
                throw err ;
            } );
     },



    uploadFile:async file  => {
        const files = await file.profilePic[0].file;
           
        const { createReadStream, filename } =files
        await new Promise(res =>
            createReadStream()
              .pipe(createWriteStream(path.join(__dirname, "./", filename)))
              .on("close", res)
          );
        return true;
      }

   
   
}