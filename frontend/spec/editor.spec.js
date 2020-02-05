import {Editor} from "../src/editor";
import {Position} from "../src/model/position";
import {ChangeObject, CHANGE_OBJECT_TYPE} from "../src/model/changeObject";
import {TiTreeNode} from "../src/model/tiTreeNode";


describe("Editor", function() {

    let editor;

    beforeEach(function() {
        let divObject = document.createElement("DIV");
        let textAreaObject = document.createElement("TEXTAREA");
        divObject.appendChild(textAreaObject);
        editor = new Editor(textAreaObject);
    });

    it("inserts first value", function () {
        let value = "a";

        let changeObject = new ChangeObject(new Position(0,0),value, CHANGE_OBJECT_TYPE.INSERTION);
        editor.insert(changeObject);

        expect(editor.getValue()).toBe(value);
    });

    it("deletes the only value", function () {

        let changeObject1 = new ChangeObject(new Position(0,0),"a", CHANGE_OBJECT_TYPE.INSERTION);
        editor.insert(changeObject1);

        let changeObject2 = new ChangeObject(new Position(0,0),"", CHANGE_OBJECT_TYPE.DELETION);
        editor.delete(changeObject2);

        expect(editor.getValue()).toBe("");
    });

    it("inserts value between other", function () {
        let changeObject1 = new ChangeObject(new Position(0,0),"a", CHANGE_OBJECT_TYPE.INSERTION);
        let changeObject2 = new ChangeObject(new Position(0,1),"c", CHANGE_OBJECT_TYPE.INSERTION);
        let changeObject3 = new ChangeObject(new Position(0,2),"d", CHANGE_OBJECT_TYPE.INSERTION);
        let changeObject4 = new ChangeObject(new Position(0,1),"b", CHANGE_OBJECT_TYPE.INSERTION);
        editor.insert(changeObject1);
        editor.insert(changeObject2);
        editor.insert(changeObject3);
        expect(editor.getValue()).toBe("acd");

        editor.insert(changeObject4);
        expect(editor.getValue()).toBe("abcd");
    });

    it("deletes value between other", function () {
        let changeObject1 = new ChangeObject(new Position(0,0),"a", CHANGE_OBJECT_TYPE.INSERTION);
        let changeObject2 = new ChangeObject(new Position(0,1),"b", CHANGE_OBJECT_TYPE.INSERTION);
        let changeObject3 = new ChangeObject(new Position(0,2),"c", CHANGE_OBJECT_TYPE.INSERTION);
        let changeObject4 = new ChangeObject(new Position(0,1),"", CHANGE_OBJECT_TYPE.DELETION);
        editor.insert(changeObject1);
        editor.insert(changeObject2);
        editor.insert(changeObject3);
        expect(editor.getValue()).toBe("abc");

        editor.delete(changeObject4);
        expect(editor.getValue()).toBe("ac");
    });

    it("inserts and deletes value in second row", function () {
        let changeObject1 = new ChangeObject(new Position(0,0),"a", CHANGE_OBJECT_TYPE.INSERTION);
        let changeObject2 = new ChangeObject(new Position(0,1),"b", CHANGE_OBJECT_TYPE.INSERTION);
        let changeObject3 = new ChangeObject(new Position(0,2),"\n", CHANGE_OBJECT_TYPE.INSERTION);
        let changeObject4 = new ChangeObject(new Position(1,0),"d", CHANGE_OBJECT_TYPE.INSERTION);
        let changeObject5 = new ChangeObject(new Position(1,0),"c", CHANGE_OBJECT_TYPE.INSERTION);

        editor.insert(changeObject1);
        editor.insert(changeObject2);
        editor.insert(changeObject3);
        expect(editor.getValue()).toBe("ab\n");

        editor.insert(changeObject4);
        expect(editor.getValue()).toBe("ab\nd");

        editor.insert(changeObject5);
        expect(editor.getValue()).toBe("ab\ncd");

        let changeObject6 = new ChangeObject(new Position(0,2),"", CHANGE_OBJECT_TYPE.DELETION);
        editor.delete(changeObject6);
        expect(editor.getValue()).toBe("abcd");
    });

    it("inserts and deletes several new lines", function () {
        let changeObject1 = new ChangeObject(new Position(0,0),"a", CHANGE_OBJECT_TYPE.INSERTION);
        let changeObject2 = new ChangeObject(new Position(0,1),"\n", CHANGE_OBJECT_TYPE.INSERTION);
        let changeObject3 = new ChangeObject(new Position(1,0),"\n", CHANGE_OBJECT_TYPE.INSERTION);
        let changeObject4 = new ChangeObject(new Position(2,0),"\n", CHANGE_OBJECT_TYPE.INSERTION);

        editor.insert(changeObject1);
        editor.insert(changeObject2);
        editor.insert(changeObject3);
        editor.insert(changeObject4);
        expect(editor.getValue()).toBe("a\n\n\n");

        let changeObject5 = new ChangeObject(new Position(2,0),"", CHANGE_OBJECT_TYPE.DELETION);
        editor.delete(changeObject5);
        expect(editor.getValue()).toBe("a\n\n");

        let changeObject6 = new ChangeObject(new Position(1,0),"b", CHANGE_OBJECT_TYPE.INSERTION);
        editor.insert(changeObject6);
        expect(editor.getValue()).toBe("a\nb\n");
    });

    it('adds new line in the middle of a line', function () {
        let changeObject1 = new ChangeObject(new Position(0,0),"a", CHANGE_OBJECT_TYPE.INSERTION);
        let changeObject2 = new ChangeObject(new Position(0,1),"c", CHANGE_OBJECT_TYPE.INSERTION);
        let changeObject3 = new ChangeObject(new Position(0,1),"\n", CHANGE_OBJECT_TYPE.INSERTION);
        let changeObject4 = new ChangeObject(new Position(1,0),"b", CHANGE_OBJECT_TYPE.INSERTION);

        editor.insert(changeObject1);
        editor.insert(changeObject2);
        expect(editor.getValue()).toBe("ac");


        editor.insert(changeObject3);
        expect(editor.getValue()).toBe("a\nc");

        editor.insert(changeObject4);
        expect(editor.getValue()).toBe("a\nbc");
    });
});

