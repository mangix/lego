/**
 * Test transProperty
 * */
var transProperty = require("../lib/trans");
var expect = require("chai").expect;
describe("transProperty", function () {
    var from , to;
    beforeEach(function () {
        from = {
            single: 0,
            data: Object.create({
                m: function () {
                },
                d: {
                    deep: 1
                }
            })
        };
        to = {};
    });

    it("should set toProperty null when from is null", function () {
        var to = {};
        transProperty(null, to, "from", "to");
        transProperty("", to, "from", "to");
        transProperty(0, to, "from", "to");
        expect(to.to).to.be.null;
    });

    it("should do nothing when to is null", function () {
        transProperty(null, null, "from", "to");
        transProperty({}, null, "from", "to");
    });

    it("should set the right property when property and toProperty is single string", function () {
        transProperty(from, to, "single", "to");
        transProperty(from, to, "data", "toData");

        expect(to.to).to.equal(from.single);
        expect(to.toData).to.equal(from.data);
    });

    it("should set the right property when property is complex", function () {
        transProperty(from, to, "data.d.deep", "deep");
        transProperty(from, to, "data.m", "m");

        expect(to.deep).to.equal(from.data.d.deep);
        expect(to.m).to.equal(from.data.m);

        transProperty(from, to, "data.some.nothing", "nothing");
        expect(to.nothing).to.be.null;
    });

    it("should set the right property when toProperty is complex", function () {
        transProperty(from, to, "data.d.deep", "to.hide.deep");

        expect(to.to.hide.deep).to.equal(from.data.d.deep);
        to = {
            to: {
                hide: 1
            }
        };
        transProperty(from, to, "data.d.deep", "to.hide.deep");
        expect(to.to.hide.deep).to.equal(from.data.d.deep);
    });
});