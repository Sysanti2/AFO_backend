const mongoose =  require('mongoose');
const Schema = mongoose.Schema;
const postSchema = new Schema({
  
    titre:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required:true
    },
    type:{
        type: String,
        required : true
    },
    content:{
        type : String,
        required: true
    },
    createdDate:{
        type:  Date,
        required: true
    },
    cover:{
    type: String,
    required:true
    }
});

module.exports = mongoose.model('post',postSchema);
