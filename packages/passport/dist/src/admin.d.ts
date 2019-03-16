export default class Admin {
    private host;
    constructor(props: {
        host: string;
    });
    login(login: {
        username: string;
        password: string;
    }): Promise<any>;
    postRequest(signData: {
        uri: any;
        body: any;
        sign?: any;
    }): Promise<any>;
}
