import {
  matrixToString,
  initialStateGenerator,
  cellularAutomaton,
} from './helpers.js';

const DiffiHellmanProtocol = (fieldSize, A_secret, B_secret) => {
  const initialState = initialStateGenerator(fieldSize);

  const A_state = cellularAutomaton(initialState, A_secret);
  const B_state = cellularAutomaton(initialState, B_secret);

  const A_secretKey = matrixToString(cellularAutomaton(B_state, A_secret));
  const B_secretKey = matrixToString(cellularAutomaton(A_state, B_secret));

  const secretKey =
    A_secretKey === B_secretKey ? A_secretKey : 'Key creation failed';

  return {
    secretKeys: { A_secret, B_secret, secretKey },
    publicKeys: { initialState, A_state, B_state },
  };
};

export { DiffiHellmanProtocol };