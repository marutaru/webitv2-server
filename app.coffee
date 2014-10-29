#
# webitv2-server
#

express = require 'express'
app = express()
path = require 'path'
io = require 'socket.io'


app.set "views",__dirname+"/views"
app.set "view engine","jade"
app.set "name","webitv2"

app.use express.static(__dirname + '/public')

# routing
app.get "/",(req,res) ->
  res.render "index",
    "name":app.get "name"




# listen
server = app.listen 3000, ->
  console.log "listening on port 3000"

io = io.listen server
io.sockets.on "connection",(socket) ->
  console.log "connected"

  socket.on "disconnect",() ->
    console.log "disconnected"
