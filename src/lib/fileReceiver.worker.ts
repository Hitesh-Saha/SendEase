import { decryptFile } from "../core/FileDecryption";

const DB_NAME = 'SendEaseFileDB';
const CHUNKS_STORE = 'fileChunks';
let db: IDBDatabase;

// Initialize IndexedDB
const initDB = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      db = request.result;
      resolve();
    };

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(CHUNKS_STORE)) {
        db.createObjectStore(CHUNKS_STORE, { keyPath: 'sequence' });
      }
    };
  });
};

// Clear previous file chunks
const clearChunks = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CHUNKS_STORE], 'readwrite');
    const store = transaction.objectStore(CHUNKS_STORE);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Store a decrypted chunk
const storeChunk = async (sequence: number, chunk: Uint8Array): Promise<void> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CHUNKS_STORE], 'readwrite');
    const store = transaction.objectStore(CHUNKS_STORE);
    const request = store.put({ sequence, data: chunk });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Get all chunks and create blob
const getAllChunks = async (): Promise<Uint8Array[]> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CHUNKS_STORE], 'readonly');
    const store = transaction.objectStore(CHUNKS_STORE);
    const request = store.getAll();

    request.onsuccess = () => {
      const chunks = request.result
        .sort((a, b) => a.sequence - b.sequence)
        .map(chunk => chunk.data);
      resolve(chunks);
    };
    request.onerror = () => reject(request.error);
  });
};

// Message handler for the worker
self.onmessage = async (e: MessageEvent) => {
  const { type, chunk, sequence, aesKey, fileType } = e.data;

  try {
    switch (type) {
      case 'init':
        await initDB();
        await clearChunks();
        break;

      case 'chunk':
        if (!db) {
          throw new Error('Database not initialized');
        }
        const decryptedChunk = decryptFile(chunk, aesKey);
        await storeChunk(sequence, decryptedChunk);
        break;

      case 'download':
        if (!db) {
          throw new Error('Database not initialized');
        }
        const chunks = await getAllChunks();
        const blob = new Blob(chunks, { type: fileType });
        self.postMessage({ type: 'download-ready', blob });
        await clearChunks(); // Clean up after download
        break;

      case 'cleanup':
        if (db) {
          await clearChunks();
          db.close();
        }
        break;
    }
  } catch (error) {
    self.postMessage({ 
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

