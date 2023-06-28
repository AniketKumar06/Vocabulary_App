const mongoose = require('mongoose');
const express = require('express');
const VocabularyData = require('../models/vocabulary');
const router = express.Router();

/**
 * Method: POST
 * Action:  Adding Word By the User
 */

router.post('/postword', async (req, res, next) => {
    const { newWord, speechType, meaningEnglish, meaningHindi, exampleSentence, synonyms, antonyms, mnemomics } = req.body;
    try {
            const newWord = new VocabularyData({
                _id: new mongoose.Types.ObjectId(),
                word: word.toLowerCase(),
                speechType: speechType,
                meaningEnglish: meaningEnglish,
                meaningHindi: meaningHindi,
                exampleSentence: exampleSentence,
                synonyms: synonyms,
                antonyms: antonyms,
                mnemomics: mnemomics
            })
            await newWord.save()
                .then((result) => {
                    res.status(201).json({
                        success: true,
                        msg: "Word Successfully Update",
                        data: result
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        success: false,
                        msg: "Word Not Update"
                    })
                });
        
    } catch (err) {
        res.json(500).json({
            success: false,
            msg: "Server Error"
        });
        next(err);

    }
});


/**
 * Method: GET
 * Action:  Fetching Single Data by User 
 */


router.get('/getword', async (req, res, next) => {
    const { word, speechType, meaningEnglish, meaningHindi, exampleSentence, synonyms, antonyms, mnemomics } = req.body;
    try {
        const wordExist = await VocabularyData.findOne({ word: word.toLowerCase() });
    
        if (!wordExist) {
            return res.status(404).json({
                success: true,
                msg: "Word is not Present in Your database"
            });
        }
        else {
            res.status(200).json({
                success: true,
                msg: "Successfully Word Found!!",
                data: [wordExist]
            })
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: "Server Error"
        });
        next(err);
    }
});


/**
 * Method: GET
 * Action:  Fetching All Data by User
 */


router.get('/getallword', async (req, res, next) => {
    const { word, speechType, meaningEnglish, meaningHindi, exampleSentence, synonyms, antonyms, mnemomics } = req.body;
    try {
        const wordExist = await VocabularyData.find({});
        let len = wordExist.length;
        if (len === 0) {
            return res.status(404).json({
                success: true,
                msg: "No Vocabulary Word Present!!",
                length : `length of Vocabulary Data is ${len}`,
                data:{}
                
            });
        }
        else {

            res.status(200).json({
                success: true,
                msg: "Successfully Word Found!!",
                length : `length of Vocabulary Data is ${len}`,
                data: wordExist
            })
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: "Server Error"
        });
        next(err);
    }
});


module.exports = router;