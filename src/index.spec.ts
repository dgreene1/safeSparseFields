import { loadInterfaceAndFields } from "."
import { IUser, MockAxiosHttpClient } from "../test/fakeApi/fakeUserService";

interface IUserMinimal {
    firstName: string
}

describe('loadInterfaceAndFields', () => {

    let fakeHttpClient: MockAxiosHttpClient;

    beforeEach(()=>{
        const fakeData: IUser[] = [{
            firstName: "Bob",
            lastName: "Smith",
            group: 1
        }, {
            firstName: "Susan",
            lastName: "Storm",
            group: 1
        }]

        fakeHttpClient = new MockAxiosHttpClient(fakeData);
    })

    it('should offload the filtering to the API, but it should only get back requested properties (for an API that returns any array)', async ()=> {
        // ACT

        // So to use this library, you do have to write your API wrapper functions with the first parameter as "fields"
        //      If you do that, you can just plug the function right into the "setOriginalFunction" method
        const getUsersApiWrapper = async (fields: Array<keyof IUser>): Promise<IUser[]> => {

            const resultOfApiCall = fakeHttpClient.getUsers({
                $select: fields
            })

            return resultOfApiCall;
        }
        // ARRANGE
        const safeSparseFields = loadInterfaceAndFields<IUserMinimal>({"firstName": true});
        const getFirstNameOfUsers = safeSparseFields.setOriginalFunction(getUsersApiWrapper);
        const results = await getFirstNameOfUsers({returnAllUsers: true});

        // ASSERT
        expect(results).toContainEqual({
            firstName: expect.any(String)
        })
    })

    it('should offload the filtering to the API, but it should only get back requested properties (for an API that returns any a single item)', async ()=> {
        // ACT

        // So to use this library, you do have to write your API wrapper functions with the first parameter as "fields"
        //      If you do that, you can just plug the function right into the "setOriginalFunction" method
        const getSpecificUserWrapper = async (fields: Array<keyof IUser>, options: { firstName: string }): Promise<IUser | undefined> => {

            const resultOfApiCall = fakeHttpClient.getSpecificUser({
                $select: fields,
                firstName: options.firstName
            })

            return resultOfApiCall;
        }

        // ARRANGE
        const safeSparseFields = loadInterfaceAndFields<IUserMinimal>({
            "firstName": true
        });
        const getFirstNameOfUsers = safeSparseFields.setOriginalFunction(getSpecificUserWrapper);
        const result = await getFirstNameOfUsers({firstName: "Bob"});

        // ASSERT
        expect(result).toEqual({
            firstName: "Bob"
        })
    })

    it('should clarify if you forgot to include the type parameter', async ()=> {
        // Arrange
        const ifYouDontProvideATypeParameterThenYouCantPassARegularParameter = "If you're seeing this message, please explicitly add the type parameter for the interface you expect to have returned by the HTTP endpoint";

        // ACT
        let safeSparseFields = loadInterfaceAndFields(ifYouDontProvideATypeParameterThenYouCantPassARegularParameter);

        safeSparseFields = "If you're seeing this message, please explicitly add the type parameter for the interface you expect to have returned by the HTTP endpoint"

        // ARRANGE
        // NOTE: I know that this isn't a real test, but
        //      (a) you can't test types since they disappear at runtime
        //      (b) we have to use each function to pass the linter. So that's why we're using the safeSparseFields var
        expect(safeSparseFields).toEqual(safeSparseFields);
    })

})