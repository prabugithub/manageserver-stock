
import { IncomingMessage, ServerResponse } from "node:http";
import { HTTP_CODES } from "../Shared/Model";

export abstract class BaseRequestHandler {

    protected req: IncomingMessage;
    protected res: ServerResponse;

    constructor(req: IncomingMessage, res: ServerResponse) {
        this.req = req;
        this.res = res;
        
    }
    protected async notFoundResponse() {
        this.res.statusCode = HTTP_CODES.NOT_FOUND;
        this.res.write('not found');
    }

    protected async getRequestBody(): Promise<any> {
        return new Promise((resolve, reject) => {
            let body = '';
            this.req.on('data', (data: string) => {
                body += data;
            });
            this.req.on('end', () => {
                try {
                    resolve(JSON.parse(body))
                } catch(err) {
                    reject(err)
                }
            });
            this.req.on('error', (err) => {
                reject(err);
            });
        });
    }
    protected async getResponseData(httpcode: HTTP_CODES, res: any) {
        this.res.writeHead(httpcode, {'Content-Type': 'application/json'});
        this.res.write(JSON.stringify(res));
    }
    protected async notFoundData(message: string) {
        this.res.statusCode = HTTP_CODES.NOT_FOUND;
        this.res.write(message);
    }
    protected async notAutherizedToken(message: string) {
        this.res.statusCode = HTTP_CODES.NOT_AUTHERIZED;
        this.res.write(message);
    }
    protected async responseText(httpCode: HTTP_CODES, message: string) {
        this.res.statusCode = httpCode;
        this.res.write(message);
    }
}