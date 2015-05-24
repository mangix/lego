/**
 * Test bib/lego.js
 * */
var expect = require("chai").expect;
var Lego = require("../lib/lego");

describe("lego.Lego", function () {
    describe("Lego.start" , function(){
        it("should return this" , function(){
            var lego = new Lego();
            var params = {};
            expect(lego.start(params)).to.equal(lego);
        });

        it("should set params to this.params" , function(){
            var lego = new Lego();
            var params = {};
            lego.start(params);
            expect(lego.params).to.equal(params);
        });
    });

    describe("Lego.pipe" , function(){
        it("should throw an error when no bricks" , function(){
            var lego = new Lego();
            expect(function(){
                lego.pipe();
            }).to.throw(Error);
        });

        it("should return this" , function(){
            var lego = new Lego();
            expect(lego.pipe(new Lego.Brick())).to.equal(lego);
        });
    });

    describe("Lego.done" , function(){
        it("should return this" , function(){
            var lego = new Lego();
            expect(lego.done()).to.equal(lego);
        });
    });

    describe("Lego.top" , function(){
        it("should return this" , function(){
            var lego = new Lego();
            expect(lego.top()).to.equal(lego);
        });
    });
});