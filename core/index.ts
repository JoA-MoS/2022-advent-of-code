import { createReadStream } from 'fs';
import { createInterface } from 'readline';

export function createLineReader(file: string) {
  return createInterface({
    input: createReadStream(file),
    crlfDelay: Infinity,
  });
}
