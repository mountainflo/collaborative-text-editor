import {NewLineArray} from "../src/crdt/newLineArray";

describe("NewLineArray", function () {

    it("add new line to empty array", function () {
        let newLineArray = new NewLineArray();

        newLineArray.addNewLineReference("00", 0);
        let actual = newLineArray.getNewLineReference(0);
        expect(actual).toBe("00");
    });

    it("throws error if row param is to high", function () {
        let newLineArray = new NewLineArray();

        expect(function () {
            newLineArray.addNewLineReference("00", 1);
        }).toThrowError("row number is to high!");
    });

    it("add new line at the end of the array", function () {
        let newLineArray = new NewLineArray();

        newLineArray.addNewLineReference("00", 0);
        newLineArray.addNewLineReference("11", 1);

        expect(newLineArray.getNewLineReference(0)).toBe("00");
        expect(newLineArray.getNewLineReference(1)).toBe("11");
    });

    it("add new line at the beginning of the array", function () {
        let newLineArray = new NewLineArray();

        newLineArray.addNewLineReference("00", 0);
        newLineArray.addNewLineReference("11", 1);
        newLineArray.addNewLineReference("22", 0);

        expect(newLineArray.getNewLineReference(0)).toBe("22");
        expect(newLineArray.getNewLineReference(1)).toBe("00");
        expect(newLineArray.getNewLineReference(2)).toBe("11");
    });

    it("add new line to the middle of the array", function () {
        let newLineArray = new NewLineArray();

        newLineArray.addNewLineReference("00", 0);
        newLineArray.addNewLineReference("11", 1);
        newLineArray.addNewLineReference("22", 1); //l=3,r=1

        expect(newLineArray.getNewLineReference(0)).toBe("00");
        expect(newLineArray.getNewLineReference(1)).toBe("22");
        expect(newLineArray.getNewLineReference(2)).toBe("11");
    });

    it("remove new line reference", function () {
        let newLineArray = new NewLineArray();

        newLineArray.addNewLineReference("00", 0);
        newLineArray.addNewLineReference("11", 1);
        newLineArray.addNewLineReference("22", 2);

        newLineArray.removeNewLineReference(2);

        expect(newLineArray.getNewLineReference(0)).toBe("00");
        expect(newLineArray.getNewLineReference(1)).toBe("11");

        newLineArray.removeNewLineReference(0);

        expect(newLineArray.getNewLineReference(0)).toBe("11");
    });

    it("can find new line index by timestamp", function () {
        let newLineArray = new NewLineArray();

        newLineArray.addNewLineReference("00", 0);
        newLineArray.addNewLineReference("11", 1);
        newLineArray.addNewLineReference("22", 2);

        expect(newLineArray.getNewLineReferenceByTimestamp("11")).toBe(1);
        expect(newLineArray.getNewLineReferenceByTimestamp("22")).toBe(2);
    });

    it("can remove new line index by timestamp", function () {
        let newLineArray = new NewLineArray();

        newLineArray.addNewLineReference("00", 0);
        newLineArray.addNewLineReference("11", 1);
        newLineArray.addNewLineReference("22", 2);

        newLineArray.removeNewLineReferenceByTimestamp("11");

        expect(newLineArray.getNewLineReference(0)).toBe("00");
        expect(newLineArray.getNewLineReference(1)).toBe("22");
        expect(newLineArray.length()).toBe(2);
    });

});