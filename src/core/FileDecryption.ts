import forge from 'node-forge';

export const decryptFile = (encryptedData: string, aesKey: string): Uint8Array => {
  const raw = forge.util.decode64(encryptedData);
  const iv = raw.slice(0, 16);
  const encrypted = raw.slice(16);

  const decipher = forge.cipher.createDecipher("AES-CBC", aesKey);
  decipher.start({ iv });
  decipher.update(forge.util.createBuffer(encrypted));
  const success = decipher.finish();
  if (!success) throw new Error("Decryption failed");

  const outputBytes = decipher.output.getBytes();
  const buffer = new Uint8Array(forge.util.createBuffer(outputBytes).toHex().match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16)));
  return buffer;
};
