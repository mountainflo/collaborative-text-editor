import {Editor} from "../src/editor";


describe("Editor position is transformed", function() {

    it("when input text is empty", function() {

        let actual = Editor.transformMatrixPositionToSequencePosition("", 0, 0);
        expect(actual).toBe(0);
    });
});

