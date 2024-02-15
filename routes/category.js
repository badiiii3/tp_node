const express = require('express')
const router = express.Router();

router.get('/all',(req,res)=>{
    res.send([{id:1,name:"mohamed"},{id:2,name:"badii"}])
})

router.get('/one',(req,res)=>{
    res.send({id:1,name:"mohamed"})
})
module.exports = router;