import  { Account } from '../server/Model';


export enum AccessRight {
    CREATE,
    READ,
    UPDATE,
    DELETE
}

export interface UserCredentials extends Account {
    accessRights: AccessRight[]
}

export enum HTTP_CODES {
    OK = 200,
    CREATE = 201,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    NOT_AUTHERIZED = 401
}

export enum HTTP_METHODS {
    GET = 'GET',
    POST = 'POST',
    DELETE = 'DELETE',
    PUT = 'PUT',
    OPTIONS = 'OPTIONS'
}

export interface User {
    id: string,
    name: string,
    age: number,
    email: string,
    workingPosition: WorkingPosition
}

export enum WorkingPosition {
    JUNIOR,
    PROGRAMMER,
    ENGINEER,
    EXPERT,
    MANAGER
}
export enum TokenState {
    VALID,
    INVALID,
    EXPIRED
}

export interface TokenRights {
    accessRight: AccessRight[],
    state: TokenState,

}

export interface TokenValidator {
    validateToken(tokenId: string): Promise<TokenRights | undefined>;
}