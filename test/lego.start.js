/**
 * Test bib/lego.js
 * */
var expect = require("chai").expect;
var Lego = require("../lib/lego");
var Brick = Lego.Brick;
var path = require("path");

/**
 * Test Lego.prototype.start
 * */
describe("Lego.start", function () {
    var lego = new Lego();
    it("should return this", function () {
        expect(lego.start()).to.equal(lego);
    });

    it("should set params to this.params", function () {
        var params = {};
        lego.start(params);
        expect(lego.params).to.equal(params);
    });


});