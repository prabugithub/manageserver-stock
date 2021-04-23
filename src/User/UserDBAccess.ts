
import Nedb = require('nedb');
import { User } from '../Shared/Model';

export class UserDBAccess {
    private nedb: Nedb;

    constructor() {
       this.nedb = new Nedb('database/Users.db');
       this.nedb.loadDatabase();
    }

    public putUser(user: User) {
        return new Promise((resolve, reject) => {
            if(!user.id) {
                user.id = this.createUserId();
            }
            this.nedb.insert(user, (err) => {
                if(err) {
                    reject(err);
                } else {
                    resolve('Successfully inserted');
                }
            })
        });
    }
    createUserId(): string {
        return Math.random().toString(36).slice(2);
    }
    public async getUserByName(username: string): Promise<User[]> {
        const regEx = new RegExp(username);
        return new Promise((resolve, reject) => {
            this.nedb.find({name: regEx}, (err: Error, docs: any) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            })
        });
    }
    public async getUserByID(userid: string): Promise<User | undefined> {
        return new Promise((resolve, reject) => {
            this.nedb.find({id: userid}, (err: Error, docs: any) => {
                if(err) {
                    reject(err);
                } else {
                    if(docs.length === 0 ) {
                        resolve(undefined);
                    } else {
                        resolve(docs[0]);
                    }
                }
            })
        });
    }
    public async deleteUser(userId: string): Promise<boolean> {
        const operationSuccess = await this.deleteUserFromDb(userId);
        this.nedb.loadDatabase();
        return operationSuccess;
    }
    private async deleteUserFromDb(userid: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.nedb.remove({id: userid}, (err, deletedCount: number) => {
                if(err) {
                    reject(err);
                } else {
                    if(deletedCount === 0 ) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                }
            })
        });
    }
}