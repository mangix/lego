/**
 * test lib/setting.js
 * */
var expect = require("chai").expect;
var setting = require("../lib/setting");
var path = require("path");

describe("Lego.setting" , function(){

    describe("setting.get , set" , function(){
        it("should return the correct value after set" , function(){
            var value = {};
            setting.set("test" , value);
            expect(setting.get("test")).to.equal(value);
        });
    });

    describe("setting.viewPath",function(){
        it("should return the path join with setting.get('views')",function(){
            var views = setting.get("views");
            var p = "somepath";

            expect(setting.viewPath(p)).to.equal(path.join(setting.get("views") , p));

        });
    });


});