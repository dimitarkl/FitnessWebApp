import * as jwt from 'jsonwebtoken';

const sign = (payload: object, secret: string, options?: any): Promise<string> => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, options ?? {}, (err: Error | null, token?: string) => {
            if (err) reject(err);
            else resolve(token as string);
        });
    });
};

const verify = (token: string, secret: string, options?: any): Promise<object | string> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, options ?? {}, (err: Error | null, decoded?: object | string) => {
            if (err) reject(err);
            else resolve(decoded as object | string);
        });
    });
};

export default {
    sign,
    verify,
};