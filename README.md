# Cows in Space

This is a game which was made for a course in data communication where the goal was to create an online game.
We decided add a fun twist and call it "cows in space"

## Setup

Install dependencies:
> npm install

Install MongoDB 
> See nearest search engine

## Run

To start the database create directory "data" and run:
> mongod --dbpath data

To start the web server, game server, and the client run:
> npm start

If changes are made to the server or client while `npm start` is running,
the code will be recompiled, the servers will be restarted, and the browser
will be updated automatically.

## Project Structure

* `build/` Compiled files
* `client/` Client source files
* `server/` Server source files

Both the server and the client uses ES6 (see [here](http://es6-features.org/) and [here](https://webapplog.com/es6/)).
