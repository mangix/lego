var expect = require("chai").expect;
var Lego = require("../lib/lego");
var Brick = Lego.Brick;
var path = require("path");
Lego.setting.set("views", path.join(__dirname, "views"));
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

    var sucWithView = Brick.create("sucWithView", function (p, finish) {
        finish(Brick.SUCCESS);
    }, "/test.jade");
    var failWithView = Brick.create("failWithView", function (p, finish) {
        finish(Brick.FAIL);
    }, '/test.jade');

    it("should return this", function () {
        expect(lego.done()).to.equal(lego);
    });

    it("should get data from each Brick", function () {
        lego.pipe(suc, fail).done(function (data) {
            expect(suc.Name in data).to.be.true;
            expect(fail.Name in data).to.be.true;
            expect(suc.Name + "View" in data).to.be.false;
            expect(fail.Name + "View" in data).to.be.false;
        });
    });

    it("should get View property if view defined in brick", function () {
        lego.pipe(sucWithView, failWithView).done(function (data) {
            expect(sucWithView.Name + "View" in data).to.be.true;
            expect(failWithView.Name + "View" in data).to.be.true;

        })
    });


});