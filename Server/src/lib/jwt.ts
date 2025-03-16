import jwt from 'jsonwebtoken'

const sign = (payload: object, secret: string, options?: jwt.SignOptions): Promise<string> => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, options ?? {}, (err, token) => {
            if (err) reject(err);
            else resolve(token as string);
        });
    });
};

const verify = (token: string, secret: string, options?: jwt.VerifyOptions): Promise<object | string> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, options ?? {}, (err, decoded) => {
            if (err) reject(err);
            else resolve(decoded as object | string);
        });
    });
};

export default {
    sign,
    verify,
};