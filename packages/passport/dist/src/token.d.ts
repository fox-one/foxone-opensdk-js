export declare function generateToken(keyAndSign: {
    key: string;
    secret: string;
    requestSign: string;
}): Promise<any>;
export declare function generateTokenWithPIN(keyAndSign: {
    key: string;
    secret: string;
    requestSign: string;
    pin: string;
}): Promise<any>;
export declare function decodeToken(token: string): any;
