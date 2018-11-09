type Id = string;

export type Transaction = {
  id: Id;
  amount: number;
};

export type SplitResult = {
  id: Id;
  amount: number;
};

type TotalObj = {
  [key: string]: number;
};

const filterIfIds = (transactions: Transaction[], ids?: Id[]) =>
  ids ? transactions.filter(t => ids.includes(t.id)) : transactions;

const transactionsReducer = (totalObj: TotalObj, transaction: Transaction) => {
  const { id, amount } = transaction;
  const currentSum = totalObj[id] || 0;

  return {
    ...totalObj,
    [id]: currentSum + amount
  };
};

const reduceTransactions = (transactions: Transaction[]): SplitResult[] =>
  Object.entries(transactions.reduce(transactionsReducer, {})).map(
    ([id, amount]: [string, number]) => ({
      id,
      amount
    })
  );

export const getTotalPerId = (transactions: Transaction[], ids?: Id[]) =>
  reduceTransactions(filterIfIds(transactions, ids));

const createMakeTransaction = (isNegative: boolean = false) => (
  sum: number,
  ids: Id[],
  devider?: number
): Transaction[] => {
  const multiplier = isNegative ? -1 : 1;
  const amount = (sum / (devider || ids.length)) * multiplier;

  return ids.map(id => ({
    id,
    amount
  }));
};

const splitBill = (transactions: Transaction[]) => {
  const totalObj = getTotalPerId(transactions);
  const total = totalObj.reduce(
    (sum: number, { amount }: SplitResult) => sum + amount,
    0
  );

  const numberOfIds = totalObj.length;

  return totalObj.map(item => ({
    ...item,
    amount: total / numberOfIds - item.amount
  }));
};

export const makeTransaction = createMakeTransaction();

export const makeNegativeTransaction = createMakeTransaction(true);

export default splitBill;
