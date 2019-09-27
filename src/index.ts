
type ResolvedPromise<T> = T extends Promise<infer R> ? R : T;
type SingleNotArray<T> = T extends Array<infer R> ? R : T;
type SingleSynchronousResult<T> = SingleNotArray<ResolvedPromise<T>>;
/**
 * Include from T those types that are not assignable to U
 */
type Include<T, U> = T extends U ? T : never;


class FieldsAwareContext<TSubset extends object | void>{
    protected calculatedFields: Array<(keyof TSubset)>;

    constructor( calculatedFields: Array<(keyof TSubset)> ){
        this.calculatedFields = calculatedFields;
    }

    public setOriginalFunction<
        TObj extends TSubset = TSubset,
        TTotalReturn extends Promise<TObj | TObj[] | undefined | null> = Promise<TObj | TObj[]>,
        TApiOptionsMinusFields = unknown
    >(funcThatTakesFields: (fields: Array<(keyof TSubset)>, apiOptions: TApiOptionsMinusFields) => TTotalReturn):
        TTotalReturn extends Promise<any> ?
            TTotalReturn extends Promise<any[]> ?
                (options: TApiOptionsMinusFields) => Promise<Array<Pick<SingleSynchronousResult<TObj>, Include<keyof SingleSynchronousResult<TObj>, keyof TSubset>>>> :
                (options: TApiOptionsMinusFields) => Promise<Pick<TObj, Include<keyof SingleSynchronousResult<TObj>, keyof TSubset>>> :
            TTotalReturn extends any[] ?
                (options: TApiOptionsMinusFields) => Array<Pick<SingleSynchronousResult<TObj>, Include<keyof SingleSynchronousResult<TObj>, keyof TSubset>>> :
                (options: TApiOptionsMinusFields) => Pick<TObj, Include<keyof SingleSynchronousResult<TObj>, keyof TSubset>>
    {

        const functionWithNarrowedType = async (options: TApiOptionsMinusFields) => {
            return funcThatTakesFields(this.calculatedFields, options);
        };

        // tslint:disable-next-line: no-any // Due to a soundness issue that the TS team is aware of, we have to use `any` to get the desired results. Read more here: https://github.com/microsoft/TypeScript/issues/13442
        return functionWithNarrowedType as any;
    }

}

type MissingGenericWarning = "If you're seeing this message, please explicitly add the type parameter for the interface you expect to have returned by the HTTP endpoint";

type NotVoid<T = void> = T extends void ? never : T;

/**
 * This factory function creates a class instance that is aware of (a) the interface you hope is returned and (b) the field/property names that that interface requires
 * @param dictionaryOfWantedFields This is an object where the keys are the names of the properties on the interface that you passed into the type parameter (Note: you must pass in a type parameter for TSubset). Once you do, these fields will be passed to your function so you can use them.
 */
export function loadInterfaceAndFields<
    TSubset extends object | void = void,
>(
    dictionaryOfWantedFields: Record<keyof NotVoid<TSubset>, true>
): TSubset extends void ?
        MissingGenericWarning :
        FieldsAwareContext<NotVoid<TSubset>> {

    const calculatedFields = Object.keys(dictionaryOfWantedFields) as Array<(keyof TSubset)>;

    const inner = new FieldsAwareContext<NotVoid<TSubset>>(calculatedFields);

    // tslint:disable-next-line: no-any // Due to a soundness issue that the TS team is aware of, we have to use `any` to get the desired results. Read more here: https://github.com/microsoft/TypeScript/issues/13442
    return inner as any;
}