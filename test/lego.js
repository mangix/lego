/**
 * Test bib/lego.js
 * */
var expect = require("chai").expect;
var Lego = require("../lib/lego");

describe("lego.Lego", function () {
    describe("Lego.start" , function(){
        it("should set params to this.params" , function(){
            var lego = new Lego();
            var params = {};
            lego.start(params);
            expect(lego.params).to.equal(params);
        })
    })
});