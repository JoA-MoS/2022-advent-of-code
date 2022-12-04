import { createReadStream } from 'fs';
import { createInterface } from 'readline';

enum Play {
  Rock = 1,
  Paper = 2,
  Scissor = 3,
}

enum Outcome {
  Win = 6,
  Tie = 3,
  Loss = 0,
}

type Move = Record<Outcome, Play>;

const scoring: Record<Play, Move> = {
  [Play.Rock]: {
    [Outcome.Win]: Play.Scissor,
    [Outcome.Tie]: Play.Rock,
    [Outcome.Loss]: Play.Paper,
  },
  [Play.Paper]: {
    [Outcome.Win]: Play.Rock,
    [Outcome.Tie]: Play.Paper,
    [Outcome.Loss]: Play.Scissor,
  },
  [Play.Scissor]: {
    [Outcome.Win]: Play.Paper,
    [Outcome.Tie]: Play.Scissor,
    [Outcome.Loss]: Play.Rock,
  },
};

const stratDecode: Record<string, Play> = {
  A: Play.Rock,
  B: Play.Paper,
  C: Play.Scissor,
  X: Play.Rock,
  Y: Play.Paper,
  Z: Play.Scissor,
};

const stratOutcomeDecode: Record<string, Outcome> = {
  // These are reversed because you want to get the play that causes an outcome
  X: Outcome.Win,
  Y: Outcome.Tie,
  Z: Outcome.Loss,
};

const getStrat2Play = (play: Play, outcome: Outcome) => scoring[play][outcome];

async function rockPaperScissors(strategyGuide: string) {
  const rl = createInterface({
    input: createReadStream(strategyGuide),
    crlfDelay: Infinity,
  });
  let count = 0;
  let score = 0;
  let strat2Score = 0;
  rl.on('line', (line) => {
    const [e1, e2] = line.split(' ');
    score += shoot(stratDecode[e1], stratDecode[e2]);

    strat2Score += shoot(
      stratDecode[e1],
      getStrat2Play(stratDecode[e1], stratOutcomeDecode[e2])
    );

    count++;
  });

  await new Promise((res) => rl.once('close', res));
  console.log(count);
  return { score, strat2Score };
}

function shoot(p1: Play, p2: Play) {
  const result = {
    p1: Play[p1],
    p2: Play[p2],
    outcome: 'TBD',
    score: -1,
  };
  if (p1 === p2) {
    result.outcome = Outcome[Outcome.Tie];
    result.score = Outcome.Tie + p2;
  } else if (scoring[p1][Outcome.Win] === p2) {
    result.outcome = Outcome[Outcome.Loss];
    result.score = Outcome.Loss + p2;
  } else {
    result.outcome = Outcome[Outcome.Win];
    result.score = Outcome.Win + p2;
  }
  // console.log(result);
  return result.score;
}

(async () => {
  const result = await rockPaperScissors('input.txt');
  console.log(result);
})();
