/**
 * Test lib/brick.js
 * */
var expect = require("chai").expect;
var Brick = require("../lib/brick");

describe("lego.brick", function () {

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

        it("should set handle to brick's prototype", function () {
            var handler = function () {
            };
            var brick = Brick.create("testBrick", handler);

            expect(brick.prototype.handle).to.be.equal(handler);
        });

        it("should set Brick.Name" , function(){
            var name = "NameOfBrick";
            var brick = Brick.create(name , function(){});
            expect(brick.Name).to.equal(name);
        });
    });

});