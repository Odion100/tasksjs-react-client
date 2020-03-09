//These are all the abstractions that make up TasksJS
const AppFactory = require("./tjs/App/App");
const ClientFactory = require("./tjs/Client/Client");
const HttpClientFactory = require("./tjs/HttpClient/HttpClient");

const App = AppFactory();
const HttpClient = HttpClientFactory();
const Client = ClientFactory();

module.exports = {
  //Export these pre-created objects for convenient object destructuring
  //These are the main utilities for app development
  App,
  HttpClient,
  Client,
  //export all modules themselves
  //all these modules export factory functions
  //to ensure non-singleton behavior
  AppFactory,
  ClientFactory,
  HttpClientFactory
};
