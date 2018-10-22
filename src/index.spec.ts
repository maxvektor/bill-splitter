import billSplitter, { makeTransaction } from "./";

describe("makeTransaction splits sum on trnsactions", () => {
  describe("splits sum on trnsactions", () => {
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

describe("billSplitter", () => {
  test("is a function", () => {
    /*
      Оля дала 1000 рублей
      Катя дала 300 рублей
      Вова дал 1500 рублей

      Сыграли Катя, Вова и Оля игру за 900 рублей // О: 700, К: 0, В: 1200
      Сыграли Катя , Вова и левый чувак игру за 600 р // О: 700, К: -200 , В: 1000
  */
    expect(typeof billSplitter).toBe("function");
  });

  test("calculates sum for one id", () => {
    const result = billSplitter([
      { id: "1", amount: 3 },
      { id: "1", amount: 5 }
    ]);

    expect(result).toEqual([{ id: "1", amount: 8 }]);
  });

  test("calculates sum for several ids", () => {
    const result = billSplitter([
      { id: "1", amount: 3 },
      { id: "1", amount: 2 },
      { id: "2", amount: 7 }
    ]);

    expect(result).toEqual([{ id: "1", amount: 5 }, { id: "2", amount: 7 }]);
  });

  test("calculates sum for negative numbers", () => {
    const result = billSplitter([
      { id: "1", amount: 3 },
      { id: "1", amount: 2 },
      { id: "2", amount: 7 }
    ]);

    expect(result).toEqual([{ id: "1", amount: 5 }, { id: "2", amount: 7 }]);
  });
});
