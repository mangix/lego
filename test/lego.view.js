/**
 * Test view
 * */

var expect = require("chai").expect;
var Lego = require("../lib/lego");
var Brick = Lego.Brick;
var path = require("path");
Lego.setting.set("views", path.join(__dirname, "views"));


describe("Lego.View", function () {
    var lego;
    var brick;
    var failBrick;
    beforeEach(function () {
        lego = new Lego();
        brick = Brick.create("testViewBrick", function (params, finish) {
            finish(Brick.SUCCESS);
        });
        failBrick = Brick.create("testFailViewBrick", function (params, finish) {
            finish(Brick.FAIL);
        });
    });

    //test view
    it("should set html correctly to brick data when viewPath set", function () {
        var viewBrick = Brick.create("brickWithView", function (params, finish) {
            finish(Brick.SUCCESS, {});
        }, "test.jade");
        lego.start().pipe(viewBrick).done(function (data) {
            expect(data["brickWithViewView"]).to.equal("test");
        });
    });

    it("should set html to empty string when view render failed", function () {
        var viewBrick = Brick.create("brickWidthWrongViewPath", function (params, finish) {
            finish(Brick.SUCCESS, {});
        }, "wrong.jade");

        lego.start().pipe(viewBrick).done(function (data) {
            expect(data.brickWidthWrongViewPathView).to.equal("");
        });
    });

    it("should set html to undefined when view not set", function () {
        lego.start().pipe(brick).done(function (data) {
            expect(data[brick.Name + "View"]).to.equal(undefined);
        });
    });

    it("should set html to error stack when view render failed in debug", function () {
        Lego.setting.set("debug", true);
        var viewBrick = Brick.create("brickWidthWrongViewPath", function (params, finish) {
            finish(Brick.SUCCESS, {});
        }, "wrong.jade");

        lego.start().pipe(viewBrick).done(function (data) {
            expect(data.brickWidthWrongViewPathView).to.not.equal("");
        });
    });

    it("should set html to empty when brick fail", function () {
        lego.start().pipe(failBrick).done(function (data) {
            expect(data[failBrick.Name + "View"]).to.equal(undefined);
        });
    })
});