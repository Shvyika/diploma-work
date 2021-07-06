import {
  binToBytes,
  bytesAmountCalc,
} from './helpers.js';

const uniformityTestBin = (str, alpha) => {
  const len = str.length;
  const amountOfOne = str.split('').filter((el) => el === '1').length;
  const amountOfZero = len - amountOfOne;
  const halfLen = len / 2;

  const statistics =
    ((amountOfZero - halfLen) ** 2 + (amountOfOne - halfLen) ** 2) / halfLen;

  let limValue = 0;
  if (alpha === 0.01) {
    limValue += 2 * 0.3389 + 2;
  } else if (alpha === 0.05) {
    limValue += 2 * 0.3289 + 2;
  } else {
    limValue += 2 * 0.3159 + 2;
  }
  const result = statistics <= limValue ? 'Test passed' : 'Test failed';

  return statistics <= limValue;
};

const uniformityTestBytes = (str, alpha) => {
  const bytes = binToBytes(str);

  const len = bytes.length;
  const bytesAmount = bytesAmountCalc(bytes);
  const average = len / 256;

  let statistics = 0;
  for (let i = 0; i < 256; i++) {
    statistics += (bytesAmount[`${i}`] - average) ** 2 / average;
  }

  let limValue = 0;
  if (alpha === 0.01) {
    limValue += Math.sqrt(2 * 255) * 0.3389 + 255;
  } else if (alpha === 0.05) {
    limValue += Math.sqrt(2 * 255) * 0.3289 + 255;
  } else {
    limValue += Math.sqrt(2 * 255) * 0.3159 + 255;
  }
  const result = statistics <= limValue ? 'Test passed' : 'Test failed';

  return result;
};

export { uniformityTestBin, uniformityTestBytes };
