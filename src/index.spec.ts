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

describe("billSplitter and makeTransaction are work together", () => {
 test('happy path',()=>{
   
 })
});