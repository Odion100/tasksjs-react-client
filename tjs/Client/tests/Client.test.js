const { expect } = require("chai");
const ClientFactory = require("../Client");
const port = 6757;
const route = "service-test";
const url = `http://localhost:${port}/${route}`;

describe("Client Factory", () => {
  it("should return a TasksJS Client", () => {
    const Client = ClientFactory();
    expect(Client)
      .to.be.an("object")
      .that.has.property("loadService")
      .that.is.a("function");
  });
});
describe("Client", () => {
  it("should be able to use Client.loadService(url, options) to return a promise that resolve into a backend service", async () => {
    const Client = ClientFactory();
    const buAPI = await Client.loadService(url);

    expect(buAPI)
      .to.be.an("object")
      .that.has.all.keys("emit", "on", "resetConnection", "orders", "eventTester")
      .that.respondsTo("emit")
      .that.respondsTo("on")
      .that.respondsTo("resetConnection");

    expect(buAPI.orders)
      .to.be.an("object")
      .that.has.all.keys(
        "emit",
        "on",

        "__setConnection",
        "__connectionData",
        "action1",
        "action2"
      )
      .that.respondsTo("emit")
      .that.respondsTo("on")
      .that.respondsTo("emit")
      .that.respondsTo("__setConnection")
      .that.respondsTo("__connectionData")
      .that.respondsTo("action1")
      .that.respondsTo("action2");
  });
});

describe("Service", () => {
  it("should be able to call methods on the backend Client", async () => {
    const Client = ClientFactory();
    const buAPI = await Client.loadService(url);

    const results = await buAPI.orders.action1({ code: 3 });

    const results2 = await buAPI.orders.action2({ code: 11 });

    expect(results).to.deep.equal({ SERVICE_TEST_PASSED: true, code: 3, action1: true });
    expect(results2).to.deep.equal({ SERVICE_TEST_PASSED: true, code: 11, action2: true });
  });

  it("should be able to receive events emitted from the backend Client", async () => {
    const eventName = "testing";
    const Client = ClientFactory();
    const buAPI = await Client.loadService(url);

    await new Promise(resolve => {
      buAPI.eventTester.on(eventName, data => {
        console.log("Ladies and gentleman... mission accomplish!");
        expect(true).to.equal(true);
        resolve();
      });

      setTimeout(() => buAPI.eventTester.sendEvent(), 500);
    });
  });
});
