const {Schema, default: mongoose} = require('mongoose')




const DataSchema = new Schema({
    Biodata_name:{
        type:String,
        required:true
    },
    Biodata_type:{
        type:String,
        required: true
    },
    Profile_img:{
        type:String,
        required:true
    },
    Division: {
        type: String,
        required: true
    },
    Age: {
        type: Number,
        required: true
    },
    Occupation: {
        type: String,
        required: true
    },
    Height: {
        type: Number,
        required: true
    },
    Date: {
        type: Date,
        required: true
    },
    Weight: {
        type: Number,
        required: true
    },
    Race: {
        type: Number,
        required: true
    },
    Fname: {
        type: String,
        required: true
    },
    Mname: {
        type: String,
        required: true
    },
    PDivision:{
        type: String,
        required: true
    },

    Partner_age: {
        type: Number,
        required: true
    },
    Partner_height: {
        type: Number,
        required: true
    },
    Partner_weight: {
        type: Number,
        required: true
    },
    MNumber: {
        type: Number,
        required: true
    }
    ,
    email: {
        type:String,
        required: true
    }
    ,
    BioId: {
        type: Number,
        required: true
    }

})

const Data = mongoose.model('Data', DataSchema)
module.exports = Data