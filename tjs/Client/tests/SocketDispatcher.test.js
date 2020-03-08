const { expect } = require("chai");
const SocketDispatcher = require("../components/SocketDispatcher");

const namespace = "test-namespace";
const port = 4592;

describe("SocketDispatcher", () => {
  const eventName = "test-event";
  const dispatcher = SocketDispatcher(`http://localhost:${port}/${namespace}`);
  it("should return an EventDispatcher object with methods on and emit", async () => {
    expect(dispatcher)
      .to.be.an("object")
      .that.has.all.keys("on", "emit")
      .that.respondsTo("on")
      .that.respondsTo("emit");
  });
  it("Should be able to emit and handle events", done => {
    dispatcher.on(eventName, data => {
      expect(data).to.deep.equal({ testPassed: true });
      done();
    });
    dispatcher.on("connect", () => console.log(`I'm all the way connected!`));
    setTimeout(() => socket.emit("dispatch", { name: eventName, data: { testPassed: true } }), 500);
  });
});

describe("SocketDispatcher.apply()", () => {
  const eventName = "testing-event";
  const dispatcher = SocketDispatcher.apply({}, [`http://localhost:${port}/${namespace}`]);
  it("should return an EventDispatcher object with methods on and emit", async () => {
    expect(dispatcher)
      .to.be.an("object")
      .that.has.all.keys("on", "emit")
      .that.respondsTo("on")
      .that.respondsTo("emit");
  });
  it("Should be able to emit and handle events", done => {
    dispatcher.on(eventName, data => {
      expect(data).to.deep.equal({ testPassed: true });
      console.log(`I'm all the way connected too!`);
      done();
    });

    setTimeout(() => socket.emit("dispatch", { name: eventName, data: { testPassed: true } }), 500);
  });
});
