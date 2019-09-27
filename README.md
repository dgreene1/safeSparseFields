[![Coverage Status](https://coveralls.io/repos/github/dgreene1/safeSparseFields/badge.svg?branch=master)](https://coveralls.io/github/dgreene1/safeSparseFields?branch=master)

# safeSparseFields
A zero-dependency helper for instructing an API to return a sparse fieldset in a strongly-typed manner (useful for OData and JSON API).

## Rationale

* When you're a client of an HTTP API endpoint, you have to write a function that wraps that API call
  * If you ever want to pass a sparse fieldset specifier (like [JSON API's](https://jsonapi.org/examples/#sparse-fieldsets) `fields` property or OData's `$select` property), then you might end up with multiple API wrapper functions.
    * For instance:
      * `function getUsers(fieldsToSelect: string): IUser[] { return axios.get(theUrl, { $select: fieldsToSelect }) } `
      * `function getUsersButOnlyTheirNames(): IUserAndName[] { return getUsers('id,name') }`
      * `function getUsersButOnlyTheirNamesAndAddress(): IUserAndNameAndAddress[] { return getUsers('id,name,address') }`
    * The problem with the above approach are:
      * you have to manually write each of these wrapper functions whenever you decide to pass in a different set of fields
      * it's not very type safe since there's nothing from preventing you from passing the wrong fields and not knowing why you're not getting the right properties back. See the example below...

### An example of how `$select` and `fields` are unsafe without this library
```ts
export interface IUser {
    firstName: string,
    lastName: string,
    group: number
}

function getUsersApiWrapper(fieldsToSelect: string): IUser[] {
    return axios.get(`https://someUrl.com/api/user?$select=${fieldsToSelect}}`);
}

const users = getUsersApiWrapper('firstName,lName')

// Notice that the lastName property won't get printed because you didn't select it. You selected lName which is not a property on IUser
console.log(users); // prints [{firstName: "Bob"}, ...]
```

## A better approach (by using safeSparseFields)

By using this `safeSparseFields` library, you don't have to worry about the types and the fields not matching up because the library ensures that they're identical.

```ts
import { loadInterfaceAndFields } from 'safe-sparse-fields';
export interface IUser {
    firstName: string,
    lastName: string,
    group: number
    otherProp: string,
    anotherProp: string,
}

export interface IUserMinimal {
    firstName: string,
    lastName: string
}

function getUsersApiWrapper(fieldsArray: Array<keyof IUser>): IUser[] {
    // NOTE: It is up to you to concatenate the fieldsArray in the way that the server expects it. We only provide the fields in a type safe way and coerce the response type
    const fieldsToSelect = fieldsArray.join(',');

    return axios.get(`https://someUrl.com/api/user?$select=${fieldsToSelect}}`);
}

const getUsersNames = loadInterfaceAndFields<IUserMinimal>({
    "firstName": true,
    "lastName": true
}).setOriginalFunction(getUsersApiWrapper);

const users = getUsersApiWrapper(getUsers)

// We get the properties we wanted! Yay!
console.log(users); // prints [{firstName: "Bob", lastName: "Smith"}, ...]
```