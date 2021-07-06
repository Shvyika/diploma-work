import {
  matrixToString,
  cellularAutomaton,
  findKeyCandidates,
  isTextLucid
} from './helpers.js';

const diffiHellmanAttack1 = (initialState, A_state, B_state) => {
  const A_stateStr = matrixToString(A_state);
  const B_stateStr = matrixToString(B_state);

  let A_counter = 0;
  let A_tempState = [];
  let B_counter = 0;
  let B_tempState = [];
  let tempState = JSON.parse(JSON.stringify(initialState));

  while (
    matrixToString(A_tempState) !== A_stateStr ||
    matrixToString(B_tempState) !== B_stateStr
  ) {
    tempState = cellularAutomaton(tempState, 1);

    if (matrixToString(A_tempState) !== matrixToString(A_state)) {
      A_counter++;
      A_tempState = JSON.parse(JSON.stringify(tempState));
    }

    if (matrixToString(B_tempState) !== matrixToString(B_state)) {
      B_counter++;
      B_tempState = JSON.parse(JSON.stringify(tempState));
    }
  }

  const finalArr = A_counter > B_counter ? A_state : B_state;
  const finalSteps = A_counter > B_counter ? B_counter : A_counter;
  const secretKey = matrixToString(cellularAutomaton(finalArr, finalSteps));

  return secretKey;
};

const diffiHellmanAttack2 = (A_or_B_secret, A_state, B_state) => {
  const { subscriber, secret } = A_or_B_secret;

  const secretKey = matrixToString(
    subscriber === 'A'
      ? cellularAutomaton(B_state, secret)
      : cellularAutomaton(A_state, secret)
  );

  return secretKey;
};

const diffiHellmanAttack3 = (ciphertext, A_state, B_state, maxNumber) => {
  const candidates = findKeyCandidates(A_state, B_state, maxNumber);

  for(let i = 0; i < candidates.length; i++) {
    if(isTextLucid(decrypt(ciphertext, candidates[i]))) {
      return candidates[i];
    }
  }
};

export { diffiHellmanAttack1, diffiHellmanAttack2, diffiHellmanAttack3 };