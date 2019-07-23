export declare function encryptPIN(pin: string, pem: string): Promise<string>;
export declare function decryptPIN(pin: string, pem: string): Promise<string>;
export declare function verifyPEM(pin: string, pem: string, privatePem: string): Promise<string>;
