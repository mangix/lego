/**
 * Test Lego.prototype.top
 * */

var expect = require("chai").expect;
var Lego = require("../lib/lego");
var Brick = Lego.Brick;

describe("Lego.top", function () {
    var lego;
    var brick;
    beforeEach(function () {
        lego = new Lego();
        brick = Brick.create("testTopBrick", function (params, finish) {
            finish(Brick.SUCCESS);
        });
    });

    it("should return this", function () {
        expect(lego.top()).to.equal(lego);
    });

    it("param 'brick' should be Brick or BrickName", function () {
        lego.top("someUnExistBrick", "from", "to");
        expect(lego.propertyQueue.length).to.equal(0);

        lego.top({}, "from", "to");
        expect(lego.propertyQueue.length).to.equal(0);
    });

    it("param 'property','toProperty' should be String", function () {
        lego.top(brick);
        expect(lego.propertyQueue.length).to.equal(0);
    });

    it("should add to propertyQuery", function () {
        lego.top(brick, "from", "to");
        expect(lego.propertyQueue.length).to.equal(1);
        expect(lego.propertyQueue[0].brick).to.equal(brick);
        expect(lego.propertyQueue[0].property).to.equal("from");
        expect(lego.propertyQueue[0].toProperty).to.equal("to");
    });
});