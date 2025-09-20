import { encryptFile } from "../core/FileEncryption";

self.onmessage = async function (e) {
  const { file, chunkSize, aesKey } = e.data;
  let offset = 0;
  let sequence = 0;
  const totalSize = file.size;

  try {
    while (offset < totalSize) {
      const chunkBlob = file.slice(offset, offset + chunkSize);
      const chunk = await new Promise<Uint8Array>((resolve, reject) => {   
        const reader = new FileReader();
        reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
        reader.onerror = () => reject(new Error('Failed to read chunk'));
        reader.readAsArrayBuffer(chunkBlob);
      });

      const encrypted = encryptFile(chunk, aesKey);
      const nextOffset = Math.min(offset + chunkSize, totalSize);

      self.postMessage({
        type: "chunk",
        sequence,
        contents: encrypted,
        offset: nextOffset,
      });

      offset = nextOffset;
      sequence += 1;
    }
    self.postMessage({ type: "done" });
  } catch (error) {
    self.postMessage({ 
      type: "error",
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};