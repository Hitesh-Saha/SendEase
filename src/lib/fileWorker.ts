import { decryptFile } from "../core/FileDecryption";

// Web Worker for file processing
self.onmessage = (e) => {
  const { encryptedChunk, sequence, aesKey } = e.data;
  const decryptedChunk = decryptFile(encryptedChunk, aesKey);
  self.postMessage({ decryptedChunk, sequence });
};
