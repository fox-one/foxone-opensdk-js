export declare function generateSignRequest(request: {
    method: string;
    url: string;
    body?: any;
}): {
    uri: string;
    body: any;
    sign: string;
};
export declare function generateSignAndJWT(request: {
    method: string;
    url: string;
    body?: any;
    key: string;
    secret: string;
}): Promise<{
    url: string;
    body: any;
    headers: {
        "Authorization": string;
    };
}>;