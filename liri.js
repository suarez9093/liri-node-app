
// Variables
// ==============================================================================
var dot = require('dotenv').config();
var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require('node-spotify-api');
var fs = require("fs");
var moment = require("moment");
var command = process.argv[2];
var artist = process.argv.slice(3).join(" ");
var divider = "\n------------------------------------------------------------\n\n";

// Functions
// ==============================================================================


function concertThis() {
  axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
    .then(function (response) {

      var jsonData = response.data[0];
      var concertSummary = [
        "Artist: " + artist,
        "Name of venue: " + jsonData.venue.name,
        "Location of venue: " + jsonData.venue.country,
        "Date of event: " + moment(response.data[0].venue.datetime).format("MM DD YY")
      ].join("\n\n");

      fs.appendFile("log.txt", concertSummary + divider, function (err) {
        if (err) throw err;
        console.log(concertSummary);

      })

    })
}

function movieThis() {
  axios.get("http://www.omdbapi.com/?t=" + artist + "&y=&plot=short&apikey=trilogy").then(
    function (response) {

      var jsonData = response.data;
      var movieSummary = [
        "Title: " + jsonData.Title,
        "Year released: " + jsonData.Released,
        "IMBD Rating: " + jsonData.imdbRating,
        "Metascore rating: " + jsonData.Metascore,
        "Country Produced: " + jsonData.Country,
        "Language: " + jsonData.Language,
        "Plot: " + jsonData.Plot,
        "Actors: " + jsonData.Actors
      ].join("\n\n");
      fs.appendFile("log.txt", movieSummary + divider, function (err) {
        if (err) throw err;
        console.log(movieSummary);
      }
      );


    })

}


function spotifyThisSong(artist) {

  var spotify = new Spotify(keys.spotify);
  var artist = process.argv.slice(3).join(" ");


  if (!artist) {
    artist = "The sign"
  }

  spotify.search({ type: 'track', query: artist }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    var jsonData = data.tracks.items[0];
    var spotifySummary = [
      "Artist: " + jsonData.album.artists[0].name,
      "Song Name: " + jsonData.name,
      "Preview Link: " + jsonData.href,
      "Album song is from: " + jsonData.album.name
    ].join("\n\n");


    fs.appendFile("log.txt", spotifySummary + divider, function (err) {
      if (err) throw err
      console.log("Spotify Summary", spotifySummary);
    })

  });


}


function doWhatItSays() {
  fs.readFile("random.txt", 'utf8', function (err, data) {
    if (err) throw err;
    console.log(data)

    var randomData = data.split(",");
    spotifyThisSong(randomData[0], randomData[1]);

  });

}


// Main Process
// =====================================================================


// Bands in town
if (command === "concert-this") {
  concertThis();
}

// Movie
if (command === "movie-this" && artist == undefined) {
  artist = "Mr. Nobody";
  movie();
} else if (command === "movie-this") {
  movieThis();
}

if (command === "spotify-this-song") {
  spotifyThisSong();
}

if (command === "do-what-it-says") {
  doWhatItSays();
}




