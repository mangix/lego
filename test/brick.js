/**
 * Test lib/brick.js
 * */
var expect = require("chai").expect;
var Brick = require("../lib/brick");

describe("lego.brick", function () {

    describe("Brick.create", function () {

        it("should return a sub class of Brick", function () {
            var brick = Brick.create("testBrick", function () {
            });

            expect(brick.prototype).to.be.an.instanceof(Brick);

        });
    });

});