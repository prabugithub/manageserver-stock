import { UserCredentials } from "../Shared/Model";
import Nedb = require('nedb');
import { resolve } from "node:path";
import { rejects } from "node:assert";




export class UserCredentialsDBAccess {

    private nedb: Nedb;

    constructor() {
       this.nedb = new Nedb('database/UserCredentials.db');
       this.nedb.loadDatabase();
    }

    public async putUserCredential(userCredentials: UserCredentials) : Promise<any> {
        return new Promise((resolve, reject) => {
            this.nedb.insert(userCredentials, (err, docs) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            });
        });
    }

    public async getUserCredential(username: string, password: string): Promise<UserCredentials | undefined> {
       return new Promise((resolve, reject) => {
           this.nedb.find({username: username, password: password}, (error: Error, docs: UserCredentials[]) => {
               if(error) {
                   reject(error);
               } else {
                   if(docs.length > 0) {
                       resolve(docs[0]);
                   } else {
                       resolve(undefined);
                   }
               }
        });
       });
    }

}