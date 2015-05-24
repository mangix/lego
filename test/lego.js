/**
 * Test bib/lego.js
 * */
var expect = require("chai").expect;
var Lego = require("../lib/lego");
var Brick = Lego.Brick;

describe("lego.Lego", function () {
    var lego;

    beforeEach(function(){
        lego = new Lego();
    });


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

    describe("Lego.pipe", function () {
        it("should throw an error when no bricks", function () {
            expect(function () {
                lego.pipe();
            }).to.throw(Error);
        });

        it("should return this", function () {
            expect(lego.pipe(new Lego.Brick())).to.equal(lego);
        });
    });

    describe("Lego.done", function () {
        it("should return this", function () {
            expect(lego.done()).to.equal(lego);
        });
    });

    describe("Lego.top", function () {
        it("should return this", function () {
            expect(lego.top()).to.equal(lego);
        });

        it("param 'brick' should be Brick or BrickName", function () {
            lego.top("someUnExistBrick", "from", "to");
            expect(lego.propertyQueue.length).to.equal(0);

            lego.top({} , "from" , "to");
            expect(lego.propertyQueue.length).to.equal(0);
        });

        it("param 'property','toProperty' should be String" , function(){
            var brick = Brick.create("top_brick",function(){});
            lego.top(brick);
            expect(lego.propertyQueue.length).to.equal(0);
        });
    });
});