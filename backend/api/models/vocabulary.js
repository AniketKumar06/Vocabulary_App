const mongoose = require('mongoose');

const vocabularySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    newWord: {
        type: String,
        required: true,
        
    },
    speechType: {
        type: String,
        required: true
    },
    meaningEnglish: {
        type: String,
        required: true
    },
    meaningHindi: {
        type: String,
        default: "No Meaning"
    },
    exampleSentence: {
        type: String,
        required: true
    },
    synonyms: {
        type: String,
        required: true
    },
    antonyms: {
        type: String,
        required: true

    },
    mnemomics: {
        type: String,
        required:true
    }


});



module.exports = mongoose.model('VocabularyData', vocabularySchema);