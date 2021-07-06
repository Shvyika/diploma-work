const matrixToString = (state) =>
  JSON.parse(JSON.stringify(state))
    .map((state_inner) => state_inner.join(''))
    .join('');

const initialStateGenerator = (fieldSize) => {
  const state = [];
  for (let i = 0; i < fieldSize; i++) {
    const state_inner = [];
    for (let j = 0; j < fieldSize; j++) {
      state_inner.push(Math.round(Math.random()));
    }
    state.push(state_inner);
  }
  return state;
};

const modifyField = (field) => {
  const field_cloned = JSON.parse(JSON.stringify(field)).map((item) =>
    item.join('')
  );

  const temp = [];
  field_cloned.forEach((item) => {
    let str = '';
    for (let j = 0; j < 3; j++) {
      str += item;
    }
    temp.push(str);
  });

  const result = []
    .concat(temp, temp, temp)
    .map((item) => item.split(''))
    .map((el) => el.map((ell) => +ell));

  return result;
};

const cellularAutomaton = (arr, steps) => {
  const fieldSize = arr.length;
  let state = JSON.parse(JSON.stringify(arr));

  for (let k = 0; k < steps; k++) {
    const tempState = JSON.parse(JSON.stringify(state));
    const modifiedState = modifyField(tempState);

    for (let i = fieldSize; i < fieldSize * 2; i++) {
      for (let j = fieldSize; j < fieldSize * 2; j++) {
        /* -----RULES----- */
        let sum =
          modifiedState[i + 2][j - 2] +
          modifiedState[i + 2][j - 1] +
          modifiedState[i + 2][j] +
          modifiedState[i + 2][j + 1] +
          modifiedState[i + 2][j + 2] +
          modifiedState[i + 1][j - 2] +
          modifiedState[i + 1][j - 1] +
          modifiedState[i + 1][j] +
          modifiedState[i + 1][j + 1] +
          modifiedState[i + 1][j + 2] +
          modifiedState[i][j - 2] +
          modifiedState[i][j - 1] +
          modifiedState[i][j + 1] +
          modifiedState[i][j + 2] +
          modifiedState[i - 1][j - 2] +
          modifiedState[i - 1][j - 1] +
          modifiedState[i - 1][j] +
          modifiedState[i - 1][j + 1] +
          modifiedState[i - 1][j + 2] +
          modifiedState[i - 2][j - 2] +
          modifiedState[i - 2][j - 1] +
          modifiedState[i - 2][j] +
          modifiedState[i - 2][j + 1] +
          modifiedState[i - 2][j + 2];

        const k = i - fieldSize;
        const l = j - fieldSize;
        if (tempState[k][l]) {
          sum >= 1 && sum <= 11 ? (tempState[k][l] = 1) : (tempState[k][l] = 0);
        } else {
          sum >= 1 && sum <= 10 ? (tempState[k][l] = 1) : (tempState[k][l] = 0);
        }
      }
    }
    state = tempState;
  }

  return state;
};

const findDifference = (A_state, B_state) => {
  const A_stateStr = matrixToString(A_state);
  const B_stateStr = matrixToString(B_state);

  let A_tempState = JSON.parse(JSON.stringify(A_state));
  let B_tempState = JSON.parse(JSON.stringify(B_state));

  let difference = 0;
  let biggerState = '';

  while (
    A_stateStr !== matrixToString(B_tempState) &&
    B_stateStr !== matrixToString(A_tempState)
  ) {
    difference++;

    if (A_stateStr === matrixToString(cellularAutomaton(B_tempState, 1))) {
      biggerState = 'A';
    }

    if (B_stateStr === matrixToString(cellularAutomaton(A_tempState, 1))) {
      biggerState = 'B';
    }

    A_tempState = cellularAutomaton(A_tempState, 1);
    B_tempState = cellularAutomaton(B_tempState, 1);
  }

  return { biggerState, difference };
};

const binToDecimal = (bin_arr) => parseInt(bin_arr.join(''), 2);

const binToBytes = (bin_str) => {
  const splited = [];
  for (let i = 0; i < bin_str.length; i += 8) {
    const temp = [
      bin_str[i],
      bin_str[i + 1],
      bin_str[i + 2],
      bin_str[i + 3],
      bin_str[i + 4],
      bin_str[i + 5],
      bin_str[i + 6],
      bin_str[i + 7],
    ];
    splited.push(temp);
  }

  const bytes = [];
  for (let i = 0; i < splited.length; i++) {
    bytes.push(binToDecimal(splited[i]));
  }

  return bytes;
};

const bytesAmountCalc = (bytes) => {
  const result = {};
  let byte = 0;

  for (let i = 0; i < 256; i++) {
    let amount = 0;

    for (let j = 0; j < bytes.length; j++) {
      if (bytes[j] === byte) {
        amount++;
      }
    }

    result[`${byte}`] = amount;
    byte++;
  }

  return result;
};

const findKeyCandidates = (A_state, B_state, maxNumber) => {
  const A_stateStr = matrixToString(A_state);
  const B_stateStr = matrixToString(B_state);

  let A_tempState = JSON.parse(JSON.stringify(A_state));
  let B_tempState = JSON.parse(JSON.stringify(B_state));

  let tempState = [];
  while (
    A_stateStr !== matrixToString(B_tempState) &&
    B_stateStr !== matrixToString(A_tempState)
  ) {
    A_tempState = cellularAutomaton(A_tempState, 1);
    B_tempState = cellularAutomaton(B_tempState, 1);

    if (A_stateStr === matrixToString(B_tempState)) {
      tempState = JSON.parse(JSON.stringify(B_tempState));
    }

    if (B_stateStr === matrixToString(A_tempState)) {
      tempState = JSON.parse(JSON.stringify(A_tempState));
    }
  }

  const result = [];
  for (let i = 0; i < maxNumber; i++) {
    tempState = cellularAutomaton(tempState, 1);
    result.push(matrixToString(tempState));
  }

  return result;
};

const isTextLucid = (text) => {
  const forbiddenBigrams = ['JQ', 'QG', 'QK', 'QY', 'QZ', 'WQ', 'WZ'];

  for (let i = 0; i < text.length - 1; i++) {
    for (let j = 0; j < forbiddenBigrams.length; j++) {
      if (
        `${text[i]}${text[i + 1]}`.toLowerCase() ===
        forbiddenBigrams[j].toLowerCase()
      ) {
        return false;
      }
    }
  }

  return true;
};

export {
  matrixToString,
  initialStateGenerator,
  modifyField,
  cellularAutomaton,
  findDifference,
  binToDecimal,
  binToBytes,
  bytesAmountCalc,
  findKeyCandidates,
  isTextLucid
};