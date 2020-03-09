const { expect } = require("chai");
const {
  App,
  HttpClient,
  Client,
  AppFactory,
  ClientFactory,
  HttpClientFactory
} = require("./index");

describe("TasksJS Factory functions", () => {
  it("should return a factory functions for each TasksJS abstraction", () => {
    expect(AppFactory).to.be.a("function");
    expect(ClientFactory).to.be.a("function");
    expect(HttpClientFactory).to.be.a("function");
  });

  it("should return an instance of each TasksJS abstraction", () => {});
});

describe("TasksJS Objects", () => {
  it("should return a TasksJS App", () => {
    expect(App)
      .to.be.an("object")
      .that.has.all.keys("module", "on", "emit", "loadService", "onLoad", "config")
      .that.respondsTo("module")
      .that.respondsTo("on")
      .that.respondsTo("emit")
      .that.respondsTo("loadService")
      .that.respondsTo("onLoad")
      .that.respondsTo("config");
  });

  it("should return a TasksJS Client", () => {
    expect(Client)
      .to.be.an("object")
      .that.has.property("loadService")
      .that.is.a("function");
  });

  it("should return a HttpClient instance", () => {
    expect(HttpClient)
      .to.be.an("Object")
      .that.has.all.keys("request", "upload")
      .that.respondsTo("request")
      .that.respondsTo("upload");
  });
});
