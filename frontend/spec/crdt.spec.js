import {Crdt} from "../src/crdt/crdt";

describe("Tests encapsulation by", function () {

    it("changing public fields", function () {
        let crdt = new Crdt();

        let newValue = 9;

        crdt.publicField = newValue;
        expect(crdt.publicField).toBe(newValue);
    });

    it("changing private fields", function () {
        let crdt = new Crdt();

        let privateField = crdt.getPrivateField();
        privateField = 9;

        crdt.privateField = 4;

        expect(crdt.getPrivateField()).toBe(444);
    });

    it("changing private fields", function () {
        let crdt = new Crdt();

        let actual = crdt.publicAddFunction(3);

        expect(actual).toBe(6);
    });

});