// Generated by CoffeeScript 1.8.0
(function() {
  var MongoClient, app, express, io, path, server, url;

  express = require('express');

  app = express();

  path = require('path');

  io = require('socket.io');

  MongoClient = require('mongodb').MongoClient;

  app.set("views", __dirname + "/views");

  app.set("view engine", "jade");

  app.set("name", "webitv2");

  app.use(express["static"](__dirname + '/public'));

  app.get("/", function(req, res) {
    return res.render("index", {
      "name": app.get("name")
    });
  });

  url = 'mongodb://localhost:27017/webitv2';

  server = app.listen(3000, function() {
    return console.log("listening on port 3000");
  });

  io = io.listen(server);

  io.sockets.on("connection", function(socket) {
    console.log("socket.io connected");
    socket.on("send note", function(note) {
      console.log(note);
      return MongoClient.connect(url, function(err, db) {
        if (err) {
          return console.log(err);
        }
        return db.createCollection("notes", function(err, collection) {
          if (err) {
            return console.log(err);
          }
          collection.insert(note, function(err, inserted) {
            if (err) {
              return console.log(err);
            }
            console.log(inserted);
            return db.close();
          });
          if (err) {
            return console.log(err);
          }
        });
      });
    });
    socket.on("find notes", function(uri) {
      return MongoClient.connect(url, function(err, db) {
        if (err) {
          return console.log(err);
        }
        return db.createCollection("notes", function(err, collection) {
          if (err) {
            return console.log(err);
          }
          return collection.find({
            "uri": uri
          }).toArray(function(err, notes) {
            if (err) {
              return console.log(err);
            }
            socket.emit("send notes", notes);
            return db.close();
          });
        });
      });
    });
    socket.on("find recent", function(hoge) {
      return MongoClient.connect(url, function(err, db) {
        if (err) {
          return console.log(err);
        }
        return db.createCollection("notes", function(err, collection) {
          if (err) {
            return console.log(err);
          }
          return collection.find().sort({
            time: -1
          }).limit(20).toArray(function(err, pages) {
            if (err) {
              return console.log(err);
            }
            socket.emit("send recent", pages);
            return db.close();
          });
        });
      });
    });
    return socket.on("disconnect", function() {
      return console.log("socket.io disconnected");
    });
  });

}).call(this);
