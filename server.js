const http = require('http')
const express = require('express')
const { sendCategories } = require('./sendCategories')
const { sendCoffeeDetail } = require('./sendCoffeeDetail')
const { sendCoffeeLists } = require('./sendCoffeeLists')

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.send("pong");
})
app.get('/products/categories', sendCategories)
app.get('/products', sendCoffeeLists )
app.get('/products/2', sendCoffeeDetail)

const server = http.createServer(app)

server.listen(8000, () => {
  console.log('server is listening on PORT 8000')
})