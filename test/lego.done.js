var expect = require("chai").expect;
var Lego = require("../lib/lego");
var Brick = Lego.Brick;
var path = require("path");

/**
 * Test Lego.prototype.done
 * */
describe("Lego.done", function () {
    var lego = new Lego();
    var suc = Brick.create("suc", function (p, finish) {
        finish(Brick.SUCCESS);
    });
    var fail = Brick.create("fail", function (p, finish) {
        finish(Brick.FAIL);
    });

    it("should return this", function () {
        expect(lego.done()).to.equal(lego);
    });

    it("should get data from each Brick", function () {
        lego.pipe(suc, fail).done(function (data) {
            expect(suc.Name in data).to.be.true;
            expect(fail.Name in data).to.be.true;
        });
    });




});