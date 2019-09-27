/**
 * Used to conduct "exhaustiveness checking" because when used at the end of switch statement it can create a helpful compile-time error that you have missed a possible case. Very useful for enums and for string literal unions. See more here: https://stackoverflow.com/a/39419171
 * @param x This parameter should never be called; however, at runtime it might be possible to get to this case (if your types are not up-to-date and if your providers/services are not adhering to their contracts), so therefore we throw a runtime exception with this parameter for logging purposes
 * @param
 */
export const assertUnreachable = function(x: never, moreSpecificMessage?: string): never {
	throw new Error(`Unhandled case: ${moreSpecificMessage} --> ${JSON.stringify(x)}`);
};

/**
 * Conducts "exhaustiveness checking" but also returns a replacement value
 * @param x a variable that you hope has been exhaustively checked
 * @param actionToDo a function whose result will be returned as replacement
 */
export const doIfNever = function<T>(x: never, actionToDo: ()=> T): T {
    x = x;
	return actionToDo();
};
