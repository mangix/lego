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
     * Test Lego.prototype.start
     * */
    describe("Lego.start", function () {
        it("should return this", function () {
            var params = {};
            expect(lego.start(params)).to.equal(lego);
        });

        it("should set params to this.params", function () {
            var params = {};
            lego.start(params);
            expect(lego.params).to.equal(params);
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

    /**
     * Test Lego.prototype.done
     * */
    describe("Lego.done", function () {
        it("should return this", function () {
            expect(lego.done()).to.equal(lego);
        });

        it("should get data from each Brick", function () {
            lego.pipe(brick, failBrick).done(function (data) {
                expect(brick.Name in data).to.be.true;
                expect(failBrick.Name in data).to.be.true;
            });
        });


    });

    /**
     * Test Lego.prototype.top
     * */
    describe("Lego.top", function () {
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

    /**
     * Test view
     * */
    describe("Lego.View", function () {
        //test view
        it("should set html correctly to brick data when viewPath set", function () {
            var viewBrick = Brick.create("brickWithView", function (params, finish) {
                finish(Brick.SUCCESS, {});
            }, "test.jade");
            lego.start().pipe(viewBrick).done(function (data) {
                expect(data["brickWithViewView"]).to.equal("test");
            });
        });

        it("should set html to empty when view render failed", function () {
            var viewBrick = Brick.create("brickWidthWrongViewPath", function (params, finish) {
                finish(Brick.SUCCESS, {});
            }, "wrong.jade");

            lego.start().pipe(viewBrick).done(function (data) {
                expect(data.brickWidthWrongViewPathView).to.equal("");
            });
        });

        it("should set html to empty when view not set", function () {
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

});