const { expect } = require("chai");
const ClientFactory = require("../Client");
const port = 6757;
const route = "service-test";
const url = `http://localhost:${port}/${route}`;

describe("Client Factory", () => {
  it("should return a TasksJS Client", () => {
    const Client = ClientFactory();
    expect(Client).to.be.an("object").that.has.property("loadService").that.is.a("function");
  });
});
describe("Client", () => {
  it("should be able to use Client.loadService(url, options) to return a promise that resolve into a backend service", async () => {
    const Client = ClientFactory();
    const buAPI = await Client.loadService(url);

    expect(buAPI)
      .to.be.an("object")
      .that.has.all.keys("emit", "on", "disconnect", "resetConnection", "orders", "eventTester")
      .that.respondsTo("emit")
      .that.respondsTo("on")
      .that.respondsTo("resetConnection")
      .that.respondsTo("disconnect");

    expect(buAPI.orders)
      .to.be.an("object")
      .that.has.all.keys(
        "emit",
        "on",
        "disconnect",
        "__setConnection",
        "__connectionData",
        "action1",
        "action2",
        "multiArgTest",
        "noArgTest",
        "anyArgTest"
      )
      .that.respondsTo("emit")
      .that.respondsTo("on")
      .that.respondsTo("disconnect")
      .that.respondsTo("emit")
      .that.respondsTo("__setConnection")
      .that.respondsTo("__connectionData")
      .that.respondsTo("action1")
      .that.respondsTo("action2")
      .that.respondsTo("multiArgTest")
      .that.respondsTo("noArgTest")
      .that.respondsTo("anyArgTest");
  });
});

describe("Service", () => {
  it("should be able to call methods from the frontend client to the backend ServerModule", async () => {
    const Client = ClientFactory();
    const buAPI = await Client.loadService(url);

    const results = await buAPI.orders.action1({ code: 3 });

    const results2 = await buAPI.orders.action2({ code: 11 });

    expect(results).to.deep.equal({ SERVICE_TEST_PASSED: true, code: 3, action1: true });
    expect(results2).to.deep.equal({ SERVICE_TEST_PASSED: true, code: 11, action2: true });
  });
  it("should be able to send multiple arguments (including a callback function) to the backend ServerModule", async () => {
    const Client = ClientFactory();
    const buAPI = await Client.loadService(url);
    const arg1 = 1,
      arg2 = 2,
      arg3 = 3;

    await new Promise((resolve) =>
      buAPI.orders.multiArgTest(arg1, arg2, arg3, (err, results) => {
        expect(results).to.deep.equal({
          SERVICE_TEST_PASSED: true,
          multiArgTest: true,
          arg1,
          arg2,
          arg3,
        });
        resolve();
      })
    );
  });
  it("should be able to send multiple arguments (excluding a callback and using a promise) to the backend ServerModule", async () => {
    const Client = ClientFactory();
    const buAPI = await Client.loadService(url);
    const arg1 = 4,
      arg2 = 5,
      arg3 = 6;

    const results = await buAPI.orders.multiArgTest(arg1, arg2, arg3);

    expect(results).to.deep.equal({
      SERVICE_TEST_PASSED: true,
      multiArgTest: true,
      arg1,
      arg2,
      arg3,
    });
  });
  it("should be able to send callback as the only arguments to the backend ServerModule", async () => {
    const Client = ClientFactory();
    const buAPI = await Client.loadService(url);

    await new Promise((resolve) =>
      buAPI.orders.noArgTest((err, results) => {
        expect(results).to.deep.equal({
          SERVICE_TEST_PASSED: true,
          noArgTest: true,
        });
        resolve();
      })
    );
  });
  it("should be able to send no arguments and use a promise to the backend ServerModule", async () => {
    const Client = ClientFactory();
    const buAPI = await Client.loadService(url);
    const results = await buAPI.orders.noArgTest();

    expect(results).to.deep.equal({
      SERVICE_TEST_PASSED: true,
      noArgTest: true,
    });
  });
  it("should be able to receive events emitted from the backend Client", async () => {
    const eventName = "testing";
    const Client = ClientFactory();
    const buAPI = await Client.loadService(url);

    buAPI.eventTester.on(eventName, (data, event) => {
      console.log("Ladies and gentleman... mission accomplish!");
      // console.log(data);
      // console.log(event);
      expect(data).to.deep.equal({ testPassed: true });
      expect(event).to.be.an("object").that.has.all.keys("id", "name", "data", "type");
      expect(event.name).to.equal("testing");
      expect(event.data).to.deep.equal({ testPassed: true });
      expect(event.id).to.be.a("string");
      expect(event.type).to.equal("WebSocket");
    });

    buAPI.eventTester.sendEvent();
  });
  it("should be able to send REST http requests", async () => {
    const Client = ClientFactory();
    const route = "rest-tester";
    const port = "8492";
    const url = `http://localhost:${port}/${route}`;

    const buAPI = await Client.loadService(url);
    const getResponse = await buAPI.restTester.get({ name: "GET TEST", id: 12 });
    const putResponse = await buAPI.restTester.put();
    const postResponse = await buAPI.restTester.post();
    const deleteResponse = await buAPI.restTester.delete();
    expect(getResponse).to.deep.equal({
      REST_TEST_PASSED: true,
      getResponse: true,
      name: "GET TEST",
      id: 12,
    });
    expect(putResponse).to.deep.equal({ REST_TEST_PASSED: true, putResponse: true });
    expect(postResponse).to.deep.equal({ REST_TEST_PASSED: true, postResponse: true });
    expect(deleteResponse).to.deep.equal({ REST_TEST_PASSED: true, deleteResponse: true });
  });

  it("should correctly validate the number of arguments passed to the ServerModule", async () => {
    const Client = ClientFactory();
    const buAPI = await Client.loadService(url);

    try {
      await buAPI.orders.noArgTest(3);
    } catch (error) {
      expect(error).to.deep.equal({
        TasksJSServiceError: true,
        message:
          "In valid number of arguments: Expected 1 (including a callback function), Recieved 2 (including a callback function).",
        serviceUrl: url,
        status: 400,
        fn: "noArgTest",
        module_name: "orders",
      });
    }

    try {
      await buAPI.orders.multiArgTest();
    } catch (error) {
      expect(error).to.deep.equal({
        TasksJSServiceError: true,
        message:
          "In valid number of arguments: Expected 4 (including a callback function), Recieved 1 (including a callback function).",
        serviceUrl: url,
        status: 400,
        fn: "multiArgTest",
        module_name: "orders",
      });
    }
    const arg1 = 1;
    const arg2 = 2;
    const results = await buAPI.orders.anyArgTest(arg1, arg2);

    expect(results).to.deep.equal({
      SERVICE_TEST_PASSED: true,
      anyArgTest: true,
      arg1,
      arg2,
    });
  });
  it("should be able to use 'useReturnValue' configuration option to enable synchronouse return values from ServerModule methods", async () => {
    const route = "sync/test";
    const port = 4920;
    const url = `http://localhost:${port}/${route}`;

    const Client = ClientFactory();
    const { AsyncMath } = await Client.loadService(url);
    const results = await AsyncMath.max(10, 2);
    expect(results).to.equal(10);
    const results2 = await AsyncMath.min(10, 2);
    expect(results2).to.equal(2);
    const results3 = await AsyncMath.round(10.2);
    expect(results3).to.equal(10);
  });
});
