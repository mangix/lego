/**
 * Test bib/lego.js
 * */
var expect = require("chai").expect;
var Lego = require("../lib/lego");
var Brick = Lego.Brick;

Lego.switchLog(false);

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
        });

        it("should return this", function () {
            expect(lego.pipe(new Lego.Brick())).to.equal(lego);
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
    });

    /**
     * Test Lego.prototype.done
     * */
    describe("Lego.done", function () {
        it("should return this", function () {
            expect(lego.done()).to.equal(lego);
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

});