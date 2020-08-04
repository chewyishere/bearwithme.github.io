const express = require('express');
const path = require('path');
const router = express.Router();
var database = null;
const databasePromise = require('../../database.js');
databasePromise.then(function (db) {
    database = db;
});

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'get products'
    })
})

router.post('/', (req, res, next) => {
    res.status(200).json({
        message: 'post products',
        product: product
    })
})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if (id === 'bearwithme') {
        var dbo = database.db("IOT");
        let arr = dbo.collection("bearWithMe").find().toArray();
        arr.then(function (result) {
            // console.log(result);
            res.status(200).json(result)
        })

    }

})

module.exports = router;