class Crdt {

    constructor() {
        this.publicField = 2;
        let privateField = 444;



        let privateFunction = function (a) {
            return a + 1;
        };

        this.publicAddFunction = function (a) {
            return privateFunction(a) + this.publicField;
        };

        this.getPrivateField = function(){
          return privateField;
        };
    }

    publicFuncOutsideConstructor(a) {
        return a + this.getPrivateField() + this.publicField;
    };

}

export {Crdt};