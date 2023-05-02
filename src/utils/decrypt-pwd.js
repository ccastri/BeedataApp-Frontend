import crypto from 'crypto';

export const decryptPwd = (password) => {
    const algorithm = 'aes256';
    const key = process.env.CRYPTO_KEY;
    const iv = process.env.CRYPTO_IV;
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    let decryptedPassword = decipher.update(password, 'hex', 'utf8');
    decryptedPassword += decipher.final('utf8');

    return decryptedPassword;
};