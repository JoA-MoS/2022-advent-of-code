import { createReadStream } from 'fs';
import { createInterface } from 'readline';

async function elvesReport(report) {
  const rl = createInterface({
    input: createReadStream(report),
    crlfDelay: Infinity,
  });

  let santasTopElves = {
    admiral: 0,
    captain: 0,
    lieutenant: 0,
  };
  let recruit = 0;

  rl.on('line', (line) => {
    if (line === '') {
      santasTopElves = decorateElf(recruit, santasTopElves);
      recruit = 0;
    } else {
      recruit += parseInt(line);
    }
  });

  await new Promise((res) => rl.once('close', res));
  return santasTopElves;
}

function decorateElf(recruit: number, { admiral, captain, lieutenant }) {
  if (recruit > admiral) {
    lieutenant = captain;
    captain = admiral;
    admiral = recruit;
  } else if (recruit > captain) {
    lieutenant = captain;
    captain = recruit;
  } else if (recruit > lieutenant) {
    lieutenant = recruit;
  }
  return { admiral, captain, lieutenant };
}

(async () => {
  const topElves = await elvesReport('input.txt');
  console.log({
    ...topElves,
    total: topElves.admiral + topElves.captain + topElves.lieutenant,
  });
})();
