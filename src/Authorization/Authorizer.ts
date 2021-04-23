import { Account, SessionToken, TokenGenerator } from "../server/Model";
import { TokenRights, TokenState } from "../Shared/Model";
import { SessionTokenDBAcess } from "./SessionTokenDBAccess";
import { UserCredentialsDBAccess } from "./UserCredentialsDBAccess";



export class Authorizer implements TokenGenerator {

    private userCredDBAccess = new UserCredentialsDBAccess();
    private sessionTokenDBAcess = new SessionTokenDBAcess();

    async generateToken(account: Account): Promise<SessionToken | undefined> {
        
        const resultAccount = await this.userCredDBAccess.getUserCredential(account.username, account.password);

        if(resultAccount) {
            const token: SessionToken = {
                accessRights: resultAccount.accessRights,
                sessionTimeOut: this.generateExpirationTime(),
                tokenId: this.generateRandomTokenId(),
                username: resultAccount.username,
                valid: true
            }
            await this.sessionTokenDBAcess.storeSessionToken(token);
            return token;
        } else {
            return undefined;
        }
    }
    public async validateToken(tokenId: string): Promise<TokenRights> {
        const token = await this.sessionTokenDBAcess.getSessionToken(tokenId);
        if(!token || !token.valid) {
            return {
                accessRight: [],
                state: TokenState.INVALID
            }
        } else if(token.sessionTimeOut < new Date()) {
            return {
                accessRight: [],
                state: TokenState.EXPIRED
            }
        } return {
            accessRight: token.accessRights,
            state: TokenState.VALID
        }
    }
    generateRandomTokenId(): string {
        return Math.random().toString(36).slice(2);
    }

    private generateExpirationTime() {
        return new Date(Date.now() + (60 * 60 * 1000));
    }

}