import { createServer } from 'http';
import { IncomingMessage, ServerResponse } from 'node:http';
import { Authorizer } from '../Authorization/Authorizer';
import { LoginHandler } from './LoginHandler';
import { UserHandler } from './UserHandler';
import { Utils } from './Utils';

export class Server {

    private authorizer: Authorizer = new Authorizer();

    createServer() {
        createServer(
            async (req: IncomingMessage, res: ServerResponse) => {
                this.addCorss(res);
            console.log('got request from:' + req.url);
            const basePath = Utils.getUrlBasePath(req.url);
            switch (basePath) {
                case 'login':
                    await new LoginHandler(req, res, this.authorizer).handleRequest();
                    break;
                case 'user':
                    await new UserHandler(req, res, this.authorizer).handleRequest();
                    break;
                default:
                    break;
            }
            res.end();
        }).listen(8080);
        console.log("server started"); 
    }
    addCorss(res: ServerResponse) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        //res.setHeader('Access-Control-Allow-Headers', 'http://localhost:8080');
        
        res.setHeader('Access-Control-Allow-Headers', '*');
    }
}