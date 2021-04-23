import { rejects } from "node:assert";
import { IncomingMessage, ServerResponse } from "node:http";
import { resolve } from "node:path";
import { HTTP_CODES, HTTP_METHODS } from "../Shared/Model";
import { BaseRequestHandler } from "./BaseRequestHandler";
import { Account, Handler, TokenGenerator } from "./Model";


export class LoginHandler extends BaseRequestHandler implements Handler {
    
    private tokenGenerator: TokenGenerator;

    constructor(req: IncomingMessage, res: ServerResponse, tokenGenerator: TokenGenerator) {
        super(req, res);
        this.tokenGenerator = tokenGenerator;
    }
    public async handleRequest(): Promise<void> {
        switch(this.req.method) {
            case HTTP_METHODS.POST:
            
                await this.writeTokenInResponse();
                break;
            case HTTP_METHODS.OPTIONS:
                this.res.writeHead(HTTP_CODES.OK);
                break;
            default:
                await this.notFoundResponse();
                break;
        }


        
    }

    private async writeTokenInResponse() {
        try {
            const body = await this.getRequestBody();
            const sessionToken = await this.tokenGenerator.generateToken(body);
            if (sessionToken) {
                this.res.statusCode = HTTP_CODES.CREATE;
                this.res.writeHead(HTTP_CODES.CREATE, {'Content-Type': 'application/json'});
                this.res.write(JSON.stringify(sessionToken));
            } else {
                this.res.statusCode = HTTP_CODES.NOT_FOUND;
                this.res.write('username or password incoreect');
            }
        } catch (error) {
            this.res.write("error: " + error.message);
        }
    }
    
    
 }