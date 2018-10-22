type Id = string;

type Transaction = {
  id: Id;
  amount: number;
};

type SplitResult = {
  id: Id;
  amount: number;
};

type TotalObj = {
  [key: string]: number;
};

const filterIfIds = (transactions: Transaction[], ids?: Id[]) =>
  ids ? transactions.filter(t => t.id in ids) : transactions;

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

const getTotalPerId = (transactions: Transaction[], ids?: Id[]) =>
  reduceTransactions(filterIfIds(transactions, ids));

export const makeTransaction = (
  sum: number,
  ids: Id[],
  devider?: number
): Transaction[] => {
  const amount = sum / (devider || ids.length);

  return ids.map(id => ({
    id,
    amount
  }));
};

export default getTotalPerId;
