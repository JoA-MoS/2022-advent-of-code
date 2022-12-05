import { Interface, createInterface } from 'readline';
import { createLineReader } from '../core';

async function getDockState(lr: Interface) {
  // read file till blank line
  const dock: string[][] = [];
  let stacks = [];
  const regxContainer = /\[(?<container>.)\].?|(?<empty>.{1,4})/g;
  for await (const line of lr) {
    if (line == '') {
      break;
    }
    const containers = Array.from(line.matchAll(regxContainer)).map(
      (v) => v.groups.container || undefined
    );
    stacks.push(containers);
  }
  stacks.length -= 1;

  // transpose array so each set of containers can be used like a stack
  // this could probably be done while reading the regex
  for (let i = stacks.length - 1; i >= 0; i--) {
    for (let j = 0; j < stacks[i].length; j++) {
      if (stacks[i][j]) {
        dock[j] = [...(dock[j] || []), stacks[i][j]];
      }
    }
  }

  console.log(dock);
  return dock;
}

async function runCrane(dock: string[][], instructions: Interface) {
  for await (const rawInstruction of instructions) {
    if (rawInstruction == '') {
      break;
    }
    // console.log(rawInstruction);
    const instruction = parseCraneInstruction(rawInstruction);
    dock = runCraneInstruction(dock, instruction);
    console.table(dock);
  }
  return dock;
}

interface CraneInstruction {
  qty: number;
  from: number;
  to: number;
}
function parseCraneInstruction(raw: string): CraneInstruction {
  const regex = /move (?<qty>\d+) from (?<from>\d+) to (?<to>\d+)/g;
  const groups = regex.exec(raw).groups;
  return {
    qty: parseInt(groups.qty),
    from: parseInt(groups.from) - 1,
    to: parseInt(groups.to) - 1,
  };
}

function runCraneInstruction(
  dock: string[][],
  { qty, from, to }: CraneInstruction
) {
  while (qty > 0) {
    dock[to].push(dock[from].pop());
    // console.log({ qty, from, to, dock });
    qty--;
  }
  return dock;
}

function getTopContainers(dock: string[][]): string {
  let top = '';
  for (const c of dock) {
    top += c.pop();
  }
  return top;
}

(async () => {
  const lr = createLineReader('input.txt');
  let dock = await getDockState(lr);
  dock = await runCrane(dock, lr);
  console.log(dock);
  console.log(getTopContainers(dock));
})();
