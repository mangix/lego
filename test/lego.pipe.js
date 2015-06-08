/**
 * Test bib/lego.js
 * */
var expect = require("chai").expect;
var Lego = require("../lib/lego");
var Brick = Lego.Brick;
var path = require("path");

Lego.switchLog(false);
Lego.setting.set("views", path.join(__dirname, "views"));

describe("lego.Lego", function () {
    var lego , brick , failBrick;

    beforeEach(function () {
        lego = new Lego();
        brick = Brick.create("testBrick", function (params, finish) {
            finish(Brick.SUCCESS);
        });
        failBrick = Brick.create("testFailBrick", function (params, finish) {
            finish(Brick.FAIL);
        });
    });


    /**
     * Test Lego.prototype.pipe
     * */
    describe("Lego.pipe", function () {
        it("should throw an error when no bricks", function () {
            expect(function () {
                lego.pipe();
            }).to.throw(Error);

            expect(function () {
                lego.pipe({})
            }).to.throw(Error);
        });

        it("should return this", function () {
            expect(lego.pipe(brick)).to.equal(lego);
        });

        it("should pass params to Brick", function () {
            var params = {
                prop1: 1,
                prop2: 2
            };
            lego.start(params).pipe(Brick.create("testBrick", function (p) {
                for (var o in params) {
                    if (params.hasOwnProperty(o)) {
                        expect(p[o]).to.equal(params[o]);
                    }
                }
            }));
        });

        it("should set Brick.Name to data", function () {
            lego.start().pipe(brick, failBrick).done(function (data) {
                expect("testBrick" in data).to.be.true;
                expect("testFailBrick" in data).to.be.true;
            });
        });

        it("should set brick data to null when brick fail", function () {
            lego.start().pipe(failBrick).done(function (data) {
                expect(data.testFailBrick).to.be.null;
            });
        });

        it("should set brick data correctly when brick success", function () {
            var sucData = {};
            lego.start().pipe(Brick.create("sucBrick", function (p, finish) {
                finish(Brick.SUCCESS, sucData);
            })).done(function (data) {
                expect(data.sucBrick).to.equal(sucData);
            });
        });

        it("should trans property correctly when top() set", function () {
            var sucData = {topData: 1};
            var sucBrick = Brick.create("sucBrick", function (p, finish) {
                finish(Brick.SUCCESS, sucData);
            });
            lego.start().pipe(sucBrick).top(sucBrick, "topData", "id").done(function (data) {
                expect(data.id).to.equal(sucData.topData);
            });
        });

        it("should pass previous data to the next pipe and all pass to done()", function () {
            var firstData = {data: 1};
            var firstBrick = Brick.create("pre", function (p, finish) {
                finish(Brick.SUCCESS, firstData);
            });
            var secondData = {data: 2};
            var secondBrick = Brick.create("next", function (p, finish) {
                expect(p.pre).to.equal(firstData);
                finish(Brick.SUCCESS, secondData);
            });
            lego.start().pipe(firstBrick).pipe(secondBrick).done(function (data) {
                expect(data.pre).to.equal(firstData);
                expect(data.next).to.equal(secondData);
            });
        });

        it("should set brick data to null when brick handler throws an exception", function () {
            var exceptionBrick = Brick.create("exceptionBrick", function (params, finish) {
                throw new Error("test exception brick");
            });
            lego.start().pipe(exceptionBrick).done(function (data) {
                expect(data.exceptionBrick).to.equal(null);

            });
        });
    });
});