
import Nedb = require('nedb');
import { SessionToken } from '../server/Model';

export class SessionTokenDBAcess {
    private nedb: Nedb;

    constructor() {
       this.nedb = new Nedb('database/SessionTokens.db');
       this.nedb.loadDatabase();
    }
    public async storeSessionToken(token: SessionToken) : Promise<void> {

        return new Promise((resolve, reject) => {
            this.nedb.insert(token, (err, docs) => {
                if(err) {
                    reject(err);
                } else {
                    resolve()
                }
            });
        });

    }

    public async getSessionToken(tokenId: string): Promise<SessionToken | undefined> {
        return new Promise((resolve, reject) => {
            this.nedb.find({tokenId: tokenId}, (err: Error, docs: any)=> {
                if(err) {
                    reject(err);
                } else {
                    if(docs.length === 0) {
                        resolve(undefined);
                    } else {
                        resolve(docs[0]);
                    }
                }
            })
        });
    }

}