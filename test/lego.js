/**
 * Test bib/lego.js
 * */
var expect = require("chai").expect;
var Lego = require("../lib/lego");
var Brick = Lego.Brick;

describe("lego.Lego", function () {
    var lego , brick;

    beforeEach(function () {
        lego = new Lego();
        brick = Brick.create("testBrick", function () {
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


    /**
     * Test Lego.prototype._transProperty
     * */
    describe("Lego._transProperty", function () {
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
            Lego._transProperty(null, to, "from", "to");
            Lego._transProperty("", to, "from", "to");
            Lego._transProperty(0, to, "from", "to");
            expect(to.to).to.be.null;
        });

        it("should do nothing when to is null", function () {
            Lego._transProperty(null, null, "from", "to");
            Lego._transProperty({}, null, "from", "to");
        });

        it("should set the right property when property and toProperty is single string", function () {
            Lego._transProperty(from, to, "single", "to");
            Lego._transProperty(from, to, "data", "toData");

            expect(to.to).to.equal(from.single);
            expect(to.toData).to.equal(from.data);
        });

        it("should set the right property when property is complex", function () {
            Lego._transProperty(from, to, "data.d.deep", "deep");
            Lego._transProperty(from, to, "data.m", "m");

            expect(to.deep).to.equal(from.data.d.deep);
            expect(to.m).to.equal(from.data.m);

            Lego._transProperty(from,to,"data.some.nothing" ,"nothing");
            expect(to.nothing).to.be.null;
        });
    });
});