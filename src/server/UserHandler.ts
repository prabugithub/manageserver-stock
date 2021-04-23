import { IncomingMessage, ServerResponse } from "node:http";
import { AccessRight, HTTP_CODES, HTTP_METHODS, TokenValidator } from "../Shared/Model";
import { UserDBAccess } from "../User/UserDBAccess";
import { BaseRequestHandler } from "./BaseRequestHandler";
import { Utils } from "./Utils";

export class UserHandler extends BaseRequestHandler {
    
    private userDBAccess = new UserDBAccess();
    private tokenValidator: TokenValidator;

    constructor(req: IncomingMessage, res: ServerResponse, tokenValidator: TokenValidator) {
        super(req, res);
        this.tokenValidator = tokenValidator;
    }

    public async handleRequest(): Promise<void> {
        switch (this.req.method) {
            case HTTP_METHODS.OPTIONS:
                this.res.writeHead(HTTP_CODES.OK);
                break;
            case HTTP_METHODS.GET:
                await this.handleGet();
                break;
            case HTTP_METHODS.PUT:
                await this.handlePut();
                break;
            case HTTP_METHODS.DELETE:
                await this.handleDelete();
                break;
            default:
                await this.notFoundResponse();
                break;
        }
    }
    private async handleGet() {
        const operationAutherized = await this.operationAutherized(AccessRight.READ);
        if (operationAutherized) {
            const queryParamUrl = Utils.getQueryParamFromUrl(this.req.url);
            if (queryParamUrl) {
                if (queryParamUrl?.query.userid) {
                    const user = await this.userDBAccess.getUserByID(queryParamUrl?.query.userid as string);
                    if (user) {
                        this.getResponseData(HTTP_CODES.OK, user);
                    } else {
                        this.notFoundResponse();
                    }
                } else if (queryParamUrl?.query.name) {
                    const users = await this.userDBAccess.getUserByName(queryParamUrl?.query.name as string);
                    this.getResponseData(HTTP_CODES.OK, users);
                } 
            } else {
                this.notFoundData('userid parameter is not found in the request');
            }
        } else {
            this.notAutherizedToken('Not valid autherization token')
        }
    }
    public async handleDelete(): Promise<void> {
        const operationAutherized = await this.operationAutherized(AccessRight.DELETE);
        if(operationAutherized) {
            const queryParamUrl = Utils.getQueryParamFromUrl(this.req.url);
            if (queryParamUrl?.query.userid) {
                const deleted = await this.userDBAccess.deleteUser(queryParamUrl?.query.userid as string);
                if (deleted) {
                    this.getResponseData(HTTP_CODES.OK, `The ${queryParamUrl?.query.userid} has been deleted`);
                } else {
                    this.getResponseData(HTTP_CODES.OK, `The ${queryParamUrl?.query.userid} was not deleted`);
                }
            } else {
                this.notFoundData('userid parameter is not found in the request');
            }
        } else {
            this.notAutherizedToken('Not valid autherization token')
        }
    }

    public async handlePut(): Promise<void> {
        const operationAutherized = await this.operationAutherized(AccessRight.CREATE);
        if(operationAutherized) {
            try {
                const user = await this.getRequestBody();
                await this.userDBAccess.putUser(user);
                this.responseText(HTTP_CODES.CREATE, `User ${user.name} inserted`);
            } catch (err) {
                this.responseText(HTTP_CODES.BAD_REQUEST, err.message)
            }
        } else {
            this.notAutherizedToken('Not valid autherization token')
        }
    }

    public async operationAutherized(operation: AccessRight): Promise<boolean> {
        const tokenId = this.req.headers.authorization;
        if(tokenId) {
            const tokenRights = await this.tokenValidator.validateToken(tokenId);
            if(tokenRights?.accessRight.includes(operation)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}