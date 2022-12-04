import { createLineReader } from '../core';

const rucksack = 'line';
const sleigh = createLineReader('input.txt');

async function unLoadRucksacks() {
  let score = 0;
  let count = 1;
  let group = [];
  let groupScore = 0;
  sleigh.on(rucksack, (toys) => {
    const dupToy = sortToys(toys);
    const priority = getToyPriority(dupToy);
    // console.log({ dupToy, priority });
    score += priority;
    group.push([...new Set(toys.split(''))]);
    if (count % 3 == 0) {
      // console.log(group);
      const inCommon = getIntersection(
        getIntersection(group.pop(), group.pop()),
        group.pop()
      );
      console.log(inCommon);
      groupScore += getToyPriority(inCommon[0]);
    }
    count++;
  });

  const x = await new Promise((resolve, reject) =>
    sleigh.once('close', (...args) => resolve(args))
  );
  console.log(score);
  console.log(groupScore);
}

function sortToys(toys: string) {
  const distinctFistHalf = [...new Set(toys.slice(0, toys.length / 2))];
  const distinctSecondHalf = [...new Set(toys.slice(toys.length / 2))];

  for (const toy of distinctFistHalf) {
    if (distinctSecondHalf.find((v) => v === toy)) return toy;
  }
}

function getIntersection(l1: string[], l2: string[]) {
  return l1.filter((v) => l2.includes(v));
}

function getToyPriority(toy: string) {
  if (toy === toy.toUpperCase()) {
    const t = toy.toLowerCase();
    return t.charCodeAt(0) - 64 - 6;
  } else {
    const t = toy.toUpperCase();
    return t.charCodeAt(0) - 64;
  }
}

(async () => {
  await unLoadRucksacks();
})();
