// require and call all of the node packages

require("dotenv").config();
var request = require("request");
var moment = require("moment");
var spotify = require("node-spotify-api");
var fs = require("fs");
var keys = require("./keys");

// use command line input (after node[0] + filename[1]) to enter information
// user should indicate the song name, movie title, or artist name in "quotation marks" on the command line 
// -- to ensure the whole thing is considered process.argv[3] 

var userInput = process.argv[2];
var dataOutput = process.argv[3];

// a switch statement to take in defined user input and then run the associated function

function switchInfo(userInput, dataOutput) {
    switch (userInput) {
        case "concert-this":
            concertThis(dataOutput);
            break;

        case "spotify-this-song":
            spotifyThis(dataOutput);
            break;

        case "movie-this":
            movieThis(dataOutput);
            break;

        case "do-what-it-says":
            doWhatItSays(dataOutput);
            break;
    }
};

// function that takes the artist and shows the details of the concert using Bands-In-Town API

function concertThis(artist) {
    request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function (error, response, body) {
        var data = JSON.parse(body)
        for (var i = 0; i < data.length; i++) {
            var date = data[i].datetime
            console.log("----- Concert Details ----- \nArtist Name: " + artist + "\nConcert Venue: " + data[i].venue.name + 
            "\nLocated in: " + data[i].venue.city + "\n Concert Date: " + moment(date).format("MM/DD/YYYY"))

        }
    })
}

// function that takes the song title and shows details using Spotify-API
// if the user doesn't indicate a song, it will display info about "The Sign"

function spotifyThis(song) {
    //if statement confirms default song
    if (song === undefined) {
        song = "The Sign"
    }

    // these are defined in keys.js and not on this file
    let config = {
        id: keys.spotify.id,
        secret: keys.spotify.secret
    }
    var spotifySong = new spotify(config);

    spotifySong.search({
        type: 'track',
        query: song
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        for (var i = 0; i < data.tracks.items[0].artists.length; i++) {
            var artists = data.tracks.items[0].artists[i].name;
            console.log("-----" + song + "-----\nSong Artist(s): " + artists)
        }
        var songlink = data.tracks.items[0].preview_url;
        console.log("Listen Here: " + songlink);
        var songalbum = data.tracks.items[0].album.name;
        console.log("Find " + song + " on " + songalbum + " album.");

    });
}

// function that takes the movie title and shows details using oMDB API
// if the user doesn't indicate a movie title, it will display info about "Mr. Nobody"

function movieThis(movieName) {
    if (movieName === undefined) {
        movieName = "Mr. Nobody"
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";


    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("-----" + movieName + "-----\nThis movie was released in: " + JSON.parse(body).Year + "\nIt currently has a rating of: " + 
            JSON.parse(body).imdbRating + "/10 on IMDB. \nIt also has a rating of: " + JSON.parse(body).Ratings[1].Value + " on Rotten Tomatoes.\n" 
            + movieName + " was produced in the following countries: " + JSON.parse(body).Country + "\nLanguage Options: " + JSON.parse(body).Language +
            "\nThe cast includes: " + JSON.parse(body).Actors + ".\nPlot Summary: " + JSON.parse(body).Plot)
        }
    })
}

// function that uses the information in random.txt file and displays in the terminal

function doWhatItSays(){
    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }
      
        // We will then print the contents of data
        console.log(data);
      
        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");
      
        // We will then re-display the content as an array for later use.
        console.log(dataArr);

        switchInfo(dataArr[0],dataArr[1]);
      });
}
switchInfo(process.argv[2], process.argv[3])