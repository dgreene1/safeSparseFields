
export interface IUser {
    firstName: string,
    lastName: string,
    group: number
}

export class MockAxiosHttpClient {

    private dataInItsDB: IUser[];

    constructor(dataToHydrateMockDBWith: IUser[]){
        this.dataInItsDB = dataToHydrateMockDBWith;
    }

    /**
     * Most servers are going to rely on their DB to select only the fields that they want
     */
    private emulateDbSelectStatement<T>(fieldsToSelect: Array<keyof T>, anItem: T): T {

        // tslint:disable-next-line: no-any
        const skinnierObj: any = {};

        Object.keys(anItem).forEach(propertyOnItem => {
            const keyAsStrict = propertyOnItem as keyof T;

            if(fieldsToSelect.includes(keyAsStrict)){
                // tslint:disable-next-line: no-unsafe-any
                skinnierObj[keyAsStrict] = anItem[keyAsStrict];
            }
        })

        // Note: A lot of SQL drivers can't tell you at compilation time which fields are being returned and which ones aren't
        //      So, we'll follow that trend and cast any to T even though it's likely Partial<T>
        return skinnierObj as T;
    }

    public getUsers(options: {
        /**
         * This is the OData keyword for returning a sparse fieldset
         */
        $select?: Array<keyof IUser>
    }): IUser[] {
        if(!options.$select){
            return this.dataInItsDB;
        } else {
            const fields = options.$select;
            return this.dataInItsDB.map(aUser => {
                return this.emulateDbSelectStatement(fields, aUser);
            });
        }
    }

    public getSpecificUser(options: {
        /**
         * This is the OData keyword for returning a sparse fieldset
         */
        $select?: Array<keyof IUser>
        /**
         * The firstName of the user that you want to get back
         */
        firstName: string
    }): IUser | undefined {
        if(!options.$select){
            return this.dataInItsDB.find(u => u.firstName === options.firstName);
        } else {
            const fields = options.$select;
            return this.dataInItsDB
                .map(aUser => {
                    return this.emulateDbSelectStatement(fields, aUser);
                }).find(u => u.firstName === options.firstName);
        }
    }
}


