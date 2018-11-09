import splitBill, {
  makeTransaction,
  makeNegativeTransaction,
  Transaction,
  getTotalPerId,
  SplitResult
} from ".";

describe("makeTransaction", () => {
  describe("splits sum on trasactions", () => {
    test("with given ids", () => {
      expect(makeTransaction(12, ["1", "2", "4"])).toEqual([
        { id: "1", amount: 4 },
        { id: "2", amount: 4 },
        { id: "4", amount: 4 }
      ]);
    });

    test("with given ids and devider", () => {
      expect(makeTransaction(12, ["1", "2", "4"], 6)).toEqual([
        { id: "1", amount: 2 },
        { id: "2", amount: 2 },
        { id: "4", amount: 2 }
      ]);
    });
  });
});

describe("makeNegativeTransaction", () => {
  describe("splits sum on trasactions and returns negative amount per id", () => {
    test("with given ids", () => {
      expect(makeNegativeTransaction(12, ["1", "2", "4"])).toEqual([
        { id: "1", amount: -4 },
        { id: "2", amount: -4 },
        { id: "4", amount: -4 }
      ]);
    });

    test("with given ids and devider", () => {
      expect(makeNegativeTransaction(12, ["1", "2", "4"], 6)).toEqual([
        { id: "1", amount: -2 },
        { id: "2", amount: -2 },
        { id: "4", amount: -2 }
      ]);
    });
  });
});

describe("getTotalPerId", () => {
  test("is a function", () => {
    expect(typeof getTotalPerId).toBe("function");
  });

  test("calculates sum for one id", () => {
    const result = getTotalPerId([
      { id: "1", amount: 3 },
      { id: "1", amount: 5 }
    ]);

    expect(result).toEqual([{ id: "1", amount: 8 }]);
  });

  test("calculates sum for several ids", () => {
    const result = getTotalPerId([
      { id: "1", amount: 3 },
      { id: "1", amount: 2 },
      { id: "2", amount: 7 }
    ]);

    expect(result).toEqual([{ id: "1", amount: 5 }, { id: "2", amount: 7 }]);
  });

  test("calculates sum for negative numbers", () => {
    const result = getTotalPerId([
      { id: "1", amount: 3 },
      { id: "1", amount: 2 },
      { id: "2", amount: 7 }
    ]);

    expect(result).toEqual([{ id: "1", amount: 5 }, { id: "2", amount: 7 }]);
  });
});

describe("splitBill", () => {
  test("is a function", () => {
    expect(typeof splitBill).toBe("function");
  });

  test("calculates sum for one id", () => {
    const result = splitBill([
      { id: "1", amount: 3 },
      { id: "1", amount: 5 }
    ]);

    expect(result).toEqual([{ id: "1", amount: 0 }]);
  });

  test("calculates sum for several ids", () => {
    const result = splitBill([
      { id: "1", amount: 3 },
      { id: "1", amount: 2 },
      { id: "2", amount: 7 }
    ]);

    expect(result).toEqual([{ id: "1", amount: 1 }, { id: "2", amount: -1 }]);
  });

});

describe("All functions scenario", () => {
  test("happy path", () => {
    const transactions: Transaction[] = [];
    /**
     * Alice Bob and Charley are splittiong bills.
     * They took a credit card and puted some moey on it.
     * A: $1000, B: $200, C: $700
     */
    const afterPayment: Transaction[] = [
      ...transactions,
      { id: "Alice", amount: 1000 },
      { id: "Bob", amount: 200 },
      { id: "Charley", amount: 700 }
    ];

    expect(getTotalPerId(afterPayment)).toEqual([
      { id: "Alice", amount: 1000 },
      { id: "Bob", amount: 200 },
      { id: "Charley", amount: 700 }
    ]);
    /**
     * At the first restaurant Alice spend $200, Bob - $50 and Charley - $200
     */
    const afterFirstPlace: Transaction[] = [
      ...afterPayment,
      { id: "Alice", amount: -200 },
      { id: "Bob", amount: -50 },
      { id: "Charley", amount: -200 }
    ];

    expect(getTotalPerId(afterFirstPlace)).toEqual([
      { id: "Alice", amount: 800 },
      { id: "Bob", amount: 150 },
      { id: "Charley", amount: 500 }
    ]);

    /**
     * Alice Bob and Charley came with Eva.
     * At the second restaurant bill was $1600. ABC decided to split it equally, Eva payd for her part in cash.
     */
    const afterSecond = [
      ...afterFirstPlace,
      ...makeNegativeTransaction(1600, ["Alice", "Bob", "Charley"], 4)
    ];

    expect(getTotalPerId(afterSecond)).toEqual([
      { id: "Alice", amount: 400 },
      { id: "Bob", amount: -250 },
      { id: "Charley", amount: 100 }
    ]);

    /**
     * Charley puted another $1000 on a credit card. This is for him and Bob
     */
    const afterSecondPayment = [
      ...afterSecond,
      ...makeTransaction(1000, ["Charley", "Bob"])
    ];

    expect(getTotalPerId(afterSecondPayment)).toEqual([
      { id: "Alice", amount: 400 },
      { id: "Bob", amount: 250 },
      { id: "Charley", amount: 600 }
    ]);

    /**
     * How match Alices money is there on card?
     */
    expect(getTotalPerId(afterSecondPayment, ["Alice"])).toEqual([
      { id: "Alice", amount: 400 }
    ]);
  });
});
