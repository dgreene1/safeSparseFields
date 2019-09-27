import { assertUnreachable, doIfNever } from "./neverCheckers";

type AStringUnion = "a" | "b";

describe('assertUnreachable', ()=>{

    it('should throw if the union has been narrowed to the point of never', ()=> {
        // Arrange
        const aValueThatShouldNeverHappen: AStringUnion = "c" as any;

        // Act
        let exceptionToTest: Error | null = null;
        try {
            if(aValueThatShouldNeverHappen === "a") {
                expect("we shouldn't get here").toBeFalsy();
            } else if (aValueThatShouldNeverHappen === "b") {
                expect("we shouldn't get here").toBeFalsy();
            } else {
                assertUnreachable(aValueThatShouldNeverHappen);
            }
        } catch(err){
            exceptionToTest = err;
        }

        // Assert
        expect(exceptionToTest).toEqual(new Error(`Unhandled case: undefined --> "c"`));
    })
})


describe('doIfNever', ()=>{

    it('should return the result of the callback if the union has been narrowed to the point of never', ()=> {
        // Arrange
        const aValueThatShouldNeverHappen: AStringUnion = "c" as any;
        const valueToExpect = `let's default to "a"`;
        const callbackToDo = ()=> valueToExpect;

        // Act
        let result: string = "uninitialized";
        if(aValueThatShouldNeverHappen === "a") {
            result = "a";
        } else if (aValueThatShouldNeverHappen === "b") {
            result = "b";
        } else {
            result = doIfNever(aValueThatShouldNeverHappen, callbackToDo);
        }

        // Assert
        expect(result).toEqual(valueToExpect);
    })
})