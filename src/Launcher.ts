import { Server } from "./server/Server";

class Launcher {
    private server: Server;
    constructor() {
        this.server = new Server();
    }
    launchApp() {
        console.log('started app');
        this.server.createServer();
    }
}

new Launcher().launchApp();