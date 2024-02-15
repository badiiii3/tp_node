const express = require('express')
// creation d'une instance of express
const app = express()
const port = 3000
const category = require('./routes/category')
app.use('/category',category)
// app.get('/', (req, res) => {
//     //res.send('<h1>Hello World!</h1>')
//     //res.send({id:1,name:"mohamed"})
//     //res.json({id:2,name:"mohamed"})
//     res.sendFile(__dirname+'/index.html')
//   })
app.get('/products', (req, res) => {
  
  res.send([{id:1,name:"mohamed"},{id:2,name:"badii"}])
  
})
app.get('/template', (req, res) => {
  
  res.redirect('products')
  
})
  
  app.listen(port, () => {
    console.log(`we app listening on port ${port}`)
  })