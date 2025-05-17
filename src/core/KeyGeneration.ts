import forge from 'node-forge';

export const generateRSAPairKeys = () => {
    const keyPair = forge.pki.rsa.generateKeyPair(2048);
    const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);
    const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);
    return {publicKey: publicKeyPem, privateKey: privateKeyPem};
};

export const generateAESKey = () => {
    const aesKey = forge.random.getBytesSync(16);
    return aesKey;
}

export const encryptAESKey = (publicKeyPem: string, aesKey: string) => {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const encryptedAESKey = forge.util.encode64(publicKey.encrypt(aesKey, 'RSA-OAEP'));
    return encryptedAESKey;
}

export const decryptAESKey = (privateKeyPem: string, encryptedAESKey: string) => {
    const encryptedKey = forge.util.decode64(encryptedAESKey);
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const decryptedAESKey = privateKey.decrypt(encryptedKey, 'RSA-OAEP');
    return decryptedAESKey;
}