import forge from 'node-forge';

export const encryptFile = (data: Uint8Array, aesKey: string): string => {
  const iv = forge.random.getBytesSync(16);
  const cipher = forge.cipher.createCipher("AES-CBC", aesKey);
  cipher.start({ iv });
  cipher.update(forge.util.createBuffer(data));
  cipher.finish();
  const encrypted = cipher.output.getBytes();
  return forge.util.encode64(iv + encrypted);
};