const runCurrying = () => {
  const add = (x, y) => x + y;
  const fivePlus = (y) => add(5, y);
  console.log(fivePlus(9));

  const curry =
    (func, curryValue) =>
    (...args) =>
      func(curryValue, ...args);

  const multiply = (x, y) => x * y;
  const sevenTimes = curry(multiply, 7);
  console.log(sevenTimes(3));
};

const runFibonacci = () => {
  const fibonacci = (() => {
    const memoization = [0, 1];
    return function f(value) {
      if (memoization[value] !== undefined) return memoization[value];
      const result = f(value - 1) + f(value - 2);
      memoization[value] = result;
      return result;
    };
  })();

  for (let index = 0; index < 30; index += 1) {
    console.log(fibonacci(index));
  }
};

const runMemoization = () => {
  const memoize = (handle, initialArray) => {
    const memoization = initialArray;
    return function func(value) {
      if (memoization[value] !== undefined) return memoization[value];
      const result = handle(func, value);
      memoization[value] = result;
      return result;
    };
  };

  const fibonacci = memoize((fib, n) => fib(n - 1) + fib(n - 2), [0, 1]);
  const factorial = memoize((fac, n) => n * fac(n - 1), [1, 1]);

  for (let index = 0; index < 10; index += 1) {
    // console.log(fibonacci(index));
    console.log(factorial(index));
  }
};

// runFibonacci();
// runMemoization();
runCurrying();
