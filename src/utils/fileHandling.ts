import { decryptFile } from "../core/FileDecryption";

// Use a WebWorker for file processing if available
const worker = typeof Worker !== 'undefined' 
  ? new Worker(new URL('./fileWorker.ts', import.meta.url), { type: 'module' })
  : null;

export const processFileChunk = async (
  encryptedChunk: string,
  sequence: number,
  aesKey: string,
  onProgress: (bytes: number) => void
): Promise<{ sequence: number; data: Uint8Array }> => {
  if (worker) {
    return new Promise((resolve) => {
      worker.postMessage({ encryptedChunk, sequence, aesKey });
      worker.onmessage = (e) => {
        const { decryptedChunk, sequence } = e.data;
        onProgress(decryptedChunk.byteLength);
        resolve({ sequence, data: decryptedChunk });
      };
    });
  } else {
    // Fallback for environments without WebWorker support
    const decryptedChunk = decryptFile(encryptedChunk, aesKey);
    onProgress(decryptedChunk.byteLength);
    return { sequence, data: decryptedChunk };
  }
};

export const downloadProcessedFile = (
  chunks: Record<number, Uint8Array>,
  fileName: string
): void => {
  // Create blob in chunks to avoid memory issues
  // const chunkSize = 1024 * 1024; // 1MB chunks
  const sortedChunks = Object.keys(chunks)
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => chunks[Number(key)]);

  const blob = new Blob(sortedChunks);
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  
  // Clean up
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
};