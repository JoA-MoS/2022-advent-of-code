import { createReadStream } from 'fs';
import { createInterface, Interface } from 'readline';

export function createLineReader(file: string): Interface {
  return createInterface({
    input: createReadStream(file),
    crlfDelay: Infinity,
  });
}
