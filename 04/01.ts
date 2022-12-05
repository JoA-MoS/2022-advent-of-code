import { createLineReader } from '../core';

const lr = createLineReader('input.txt');

async function getAllAssignmentOverlap() {
  let score = 0;
  lr.on('line', (line) => {
    const a = readAssignment(line);
    score += hasOverlap(a) ? 1 : 0;
  });
  await new Promise((resolve, reject) =>
    lr.once('close', (...args) => resolve(args))
  );
  console.log(score);
  console.log('done');
}

function readAssignment(assignments: string) {
  return assignments
    .split(',')
    .map((s) => s.split('-').map((v) => parseInt(v)));
}

function hasOverlap(assignments: number[][]) {
  console.log(assignments);
  const [a1, a2] = assignments;

  const maxMin = Math.max(a1[0], a2[0]);
  const minMax = Math.min(a1[1], a2[1]);
  console.log({ maxMin, minMax });
  const a1InA2 = a1[0] >= a2[0] && a1[1] <= a2[1];
  const a2InA1 = a2[0] >= a1[0] && a2[1] <= a1[1];
  console.log({
    a1InA2,
    a2InA1,
    overlap: a1InA2 || a2InA1 || minMax >= maxMin,
  });
  return a1InA2 || a2InA1 || minMax >= maxMin;
}

(async () => {
  await getAllAssignmentOverlap();
})();
