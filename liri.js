require("dotenv").config();
var keys = require("./keys")
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require('request'); 
var fs = require("fs"); 


var twitter = new Twitter ({
    consumer_key: keys.twitterKey.consumer_key,
    consumer_secret: keys.twitterKey.consumer_secret,
    access_token_key: keys.twitterKey.access_token_key,
    access_token_secret: keys.twitterKey.access_token_secret
});

var spotify = new Spotify ({
    id: keys.spotifyKey.id,
    secret: keys.spotifyKey.secret
});


var myTweets = {screen_name: "PureTobias"};
var songChoice = ""; 
var omdbRequest = ""; 

//Possible Commands//
//* `my-tweets`
//* `spotify-this-song` + TRACK NAME SEARCHING
//* `movie-this`
//* `do-what-it-says`

var userInput = process.argv[2]; 


if (userInput == 'my-tweets'){
    twitterApi(); 
} else if (userInput == 'spotify-this-song') {
    songCheck();
    spotifyApi(songChoice); 

} else if (userInput == 'movie-this'){
    omdbApi(); 
} else if (userInput == 'do-what-it-says'){
    readFs(); 
} else {
    console.log("This is not a valid command. . Try again!")
}


function twitterApi() {

    twitter.get("statuses/user_timeline", myTweets, function(err, tweets, res){
        if (err){
            console.log(err); 
        } else {
            console.log("Here are some tweets from " + myTweets.screen_name + ": ")
            for (var i = 0; i < 6; i++){
                var tweetIndex = [i]; 
                var dateCreated = "Date Created: " + tweets[i].created_at; 
                var tweetText = "Tweet Content: " + tweets[i].text; 
                console.log(tweetIndex, dateCreated, tweetText)
            }
        }
    })

}

function songCheck(){
    for (var i = 3; i < process.argv.length; i++){
        songChoice += " " + process.argv[i];
    }
}

function spotifyApi(songChoice) {

    spotify.search({type: "track", query: songChoice, limit: 1}, function(err, res){
    
        if (err){
            console.log(err); 
        } 

        for (var j = 0; j < res.tracks.items[0].album.artists.length; j++) {
			console.log("Artist(s): " + res.tracks.items[0].album.artists[j].name);
			console.log("Song: " + res.tracks.items[0].name);
			console.log("Song Link: " + res.tracks.items[0].external_urls.spotify);
			console.log("Album: " + res.tracks.items[0].album.name);
		}

    })

}

function movieCheck() {
    for (var i = 3; i < process.argv.length; i++) {
        omdbRequest += " " + process.argv[i];
    }
}

function omdbApi(omdbRequest) {
    
    if (omdbRequest === undefined) {
        omdbRequest = "The Thing";
    }

    const movieUrl = "http://www.omdbapi.com/?apikey=d9ef05ac&t=" + omdbRequest + "&y=&plot=short&tomatoes=true&r=json";

    request(movieUrl, function (err, res, body) {
        if (err) {
            console.log(err);
        } else {
            let movieObject = JSON.parse(body);
            let movieTitle = movieObject.Title;
            let movieYear = movieObject.Year;
            let moviePlot = movieObject.Plot;
            let movieActors = movieObject.Actors;
            console.log("Movie Title: " + movieTitle);
            console.log("Actors: " + movieActors);
            console.log("Year: " + movieYear);
            console.log("Plot: " + moviePlot);
        }
    })
};



function readFs() {

    fs.readFile("random.txt", "utf8", function (err, results) {
        const textArray = results.split(",");

        userInput = textArray[0];
        songChoice = textArray[1];

        if (userInput == 'my-tweets') {
            twitterApi();
        } else if (userInput == 'spotify-this-song') {
            songCheck();
            spotifyApi(songChoice);
        } else if (userInput == 'movie-this') {
            movieCheck();
            omdbApi(omdbRequest);
        } else if (userInput == 'do-what-it-says') {
            readFs();
        } else {
            console.log("This is not a valid command. . Try again!")
        }

    })
}; 