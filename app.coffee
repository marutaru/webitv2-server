#
# webitv2-server
#

express = require 'express'
app = express()
path = require 'path'
io = require 'socket.io'
MongoClient = require('mongodb').MongoClient


app.set "views",__dirname+"/views"
app.set "view engine","jade"
app.set "name","webitv2"

app.use express.static(__dirname + '/public')

# routing
app.get "/",(req,res) ->
  res.render "index",
    "name":app.get "name"

# mongodb
url = 'mongodb://localhost:27017/webitv2'

# listen
server = app.listen 3000, ->
  console.log "listening on port 3000"

# socket.io
io = io.listen server
io.sockets.on "connection",(socket) ->
  console.log "socket.io connected"

  socket.on "send note",(note) ->
    console.log note
    MongoClient.connect url,(err,db) ->
      return console.log err if err
      db.createCollection "notes",(err,collection)->
        return console.log err if err
        collection.insert note,(err,inserted)->
          return console.log err if err
          console.log inserted
          db.close()
        return console.log err if err

  socket.on "find notes",(uri) ->
    MongoClient.connect url,(err,db)->
      return console.log err if err
      db.createCollection "notes",(err,collection)->
        return console.log err if err
        collection.find("uri":uri).toArray (err,notes)->
          return console.log err if err
          socket.emit "send notes",notes
          db.close()

  socket.on "find recent",(hoge)->
    MongoClient.connect url,(err,db)->
      return console.log err if err
      db.createCollection "notes",(err,collection)->
        return console.log err if err
        collection.find().limit(20).toArray (err,pages)->
          return console.log err if err
          socket.emit "send recent",pages
          db.close()


  socket.on "disconnect",() ->
    console.log "socket.io disconnected"
