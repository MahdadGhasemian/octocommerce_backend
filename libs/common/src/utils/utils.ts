import { IdentifierQuery } from '../interfaces';

export const bankIdentificationNumber = (input: number): number => {
  const values = [9, 1, 2, 3, 4, 5, 6, 7, 8];
  let sum = 0;

  for (let i = 0; i < input.toString().length; i++) {
    const n = input.toString()[i];
    sum += Number(n) * values[i];
  }

  return input * 100 + (sum % 99);
};

export const getPaginationConfig = (
  defaultConfig,
  identifierQuery: IdentifierQuery,
) => {
  const config = { ...defaultConfig };
  Object.assign(
    config,
    !!Object.keys(identifierQuery).length && { where: identifierQuery },
  );

  return config;
};
