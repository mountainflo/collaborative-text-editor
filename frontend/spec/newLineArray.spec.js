import {NewLineArray} from "../src/crdt/newLineArray";
import {Timestamp} from "../src/model/timestamp";

describe("NewLineArray", function () {

    it("add new line to empty array", function () {
        let newLineArray = new NewLineArray();

        newLineArray.addNewLineReference(new Timestamp(0,0), 0);
        let actual = newLineArray.getNewLineReference(0);
        expect(actual.equals(new Timestamp(0,0))).toBeTrue();
    });

    it("throws error if row param is to high", function () {
        let newLineArray = new NewLineArray();

        expect(function () {
            newLineArray.addNewLineReference(new Timestamp(0,0), 1);
        }).toThrowError("row number is to high!");
    });

    it("add new line at the end of the array", function () {
        let newLineArray = new NewLineArray();

        newLineArray.addNewLineReference(new Timestamp(1,0), 0);
        newLineArray.addNewLineReference(new Timestamp(3,1), 1);

        expect(newLineArray.getNewLineReference(0).equals(new Timestamp(1,0))).toBeTrue();
        expect(newLineArray.getNewLineReference(1).equals(new Timestamp(3,1))).toBeTrue();
    });

    it("add new line at the beginning of the array", function () {
        let newLineArray = new NewLineArray();

        newLineArray.addNewLineReference(new Timestamp(1,0), 0);
        newLineArray.addNewLineReference(new Timestamp(3,0), 1);
        newLineArray.addNewLineReference(new Timestamp(5,0), 0);

        expect(newLineArray.getNewLineReference(0).equals(new Timestamp(5,0))).toBeTrue();
        expect(newLineArray.getNewLineReference(1).equals(new Timestamp(1,0))).toBeTrue();
        expect(newLineArray.getNewLineReference(2).equals(new Timestamp(3,0))).toBeTrue();
    });

    it("add new line to the middle of the array", function () {
        let newLineArray = new NewLineArray();

        newLineArray.addNewLineReference(new Timestamp(1,1), 0);
        newLineArray.addNewLineReference(new Timestamp(2,2), 1);
        newLineArray.addNewLineReference(new Timestamp(3,3), 1);

        expect(newLineArray.getNewLineReference(0).equals(new Timestamp(1,1))).toBeTrue();
        expect(newLineArray.getNewLineReference(1).equals(new Timestamp(3,3))).toBeTrue();
        expect(newLineArray.getNewLineReference(2).equals(new Timestamp(2,2))).toBeTrue();
    });

    it("remove new line reference", function () {
        let newLineArray = new NewLineArray();

        newLineArray.addNewLineReference(new Timestamp(4,4), 0);
        newLineArray.addNewLineReference(new Timestamp(3,1), 1);
        newLineArray.addNewLineReference(new Timestamp(1,9), 2);

        newLineArray.removeNewLineReference(2);

        expect(newLineArray.getNewLineReference(0).equals(new Timestamp(4,4))).toBeTrue();
        expect(newLineArray.getNewLineReference(1).equals(new Timestamp(3,1))).toBeTrue();

        newLineArray.removeNewLineReference(0);

        expect(newLineArray.getNewLineReference(0).equals(new Timestamp(3,1))).toBeTrue();
    });

    it("can find new line index by timestamp", function () {
        let newLineArray = new NewLineArray();

        newLineArray.addNewLineReference(new Timestamp(3,1), 0);
        newLineArray.addNewLineReference(new Timestamp(2,1), 1);
        newLineArray.addNewLineReference(new Timestamp(1,1), 2);

        expect(newLineArray.getNewLineReferenceByTimestamp(new Timestamp(2,1))).toBe(1);
        expect(newLineArray.getNewLineReferenceByTimestamp(new Timestamp(1,1))).toBe(2);
    });

    it("can remove new line index by timestamp", function () {
        let newLineArray = new NewLineArray();

        newLineArray.addNewLineReference(new Timestamp(2,1), 0);
        newLineArray.addNewLineReference(new Timestamp(3,1), 1);
        newLineArray.addNewLineReference(new Timestamp(5,1), 2);

        newLineArray.removeNewLineReferenceByTimestamp(new Timestamp(3,1));

        expect(newLineArray.getNewLineReference(0).equals(new Timestamp(2,1))).toBeTrue();
        expect(newLineArray.getNewLineReference(1).equals(new Timestamp(5,1))).toBeTrue();
        expect(newLineArray.length()).toBe(2);
    });

});