const mongoose =  require('mongoose');
const Schema = mongoose.Schema;
const regionSchema = new Schema({
  
    label:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('region',regionSchema);
