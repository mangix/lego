/**
 * Test lib/brick.js
 * */
var expect = require("chai").expect;
var Lego = require("../lib/lego");
var Brick = Lego.Brick;

Lego.switchLog(false);

describe("lego.Brick", function () {

    describe("Brick.create", function () {
        it("handle should be a function", function () {
            expect(function () {
                Brick.create("brick with no handle");
            }).to.throw(Error);
        });

        it("should return a sub class of Brick", function () {
            var brick = Brick.create("testBrick", function () {
            });

            expect(brick.prototype).to.be.an.instanceof(Brick);
        });

        it("should set bizHandle to brick's prototype", function () {
            var handler = function () {
            };
            var brick = Brick.create("testBrick", handler);

            expect(brick.prototype.bizHandle).to.be.equal(handler);
        });

        it("should set Brick.Name", function () {
            var name = "NameOfBrick";
            var brick = Brick.create(name, function () {
            });
            expect(brick.Name).to.equal(name);
        });
    });

    describe("Brick.find", function () {
        it("should find Brick from globals by Name", function () {
            var b = Brick.create("test", function () {
            });

            expect(Brick.find("unExistName")).to.equal(undefined);

            expect(Brick.find("test")).to.equal(b);

        });
    });

    describe("Brick.prototype.handle", function (done) {
        var brick;
        beforeEach(function () {
            brick = Brick.create("testHandleBrick", function (params, finish) {
                setTimeout(function () {
                    finish(Brick.SUCCESS);
                }, 100);
            });
        });

        it("should finish with status SUCCESS when timeout not set", function () {
            new brick().handle({}, function () {
                expect(stack).to.equal(Brick.SUCCESS);
            });
        });

        it("should finish with status TIMEOUT when timeout", function () {
            new brick().handle({}, function (status, data) {
                expect(status).to.equal(Brick.TIMEOUT);
                done();
            }, 100);
        });

        it("should finish with status SUCCESS when not timeout", function () {
            new brick().handle({}, function (status) {
                expect(status).to.equal(Brick.SUCCESS);
            }, 1000);
        });
    });

});