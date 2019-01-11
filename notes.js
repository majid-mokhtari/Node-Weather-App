const fib = n => {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
};

module.exports.age = 3;
module.exports.slowFib = fib;
