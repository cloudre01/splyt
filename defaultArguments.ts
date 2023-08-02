type FunctionWithDefaults<T extends any[], R> = (...args: T) => R;

type FunctionWithParams<T extends any[], R> = FunctionWithDefaults<T, R> & {
  __params__?: string[];
};

type DefaultArguments = {
  [key: string]: any;
};

function defaultArguments<T extends any[], R>(
  func: FunctionWithParams<T, R>,
  defaults: Partial<DefaultArguments>
): FunctionWithParams<Partial<T>, R> {
  let paramNames: string[] = [];

  if (func.__params__) {
    paramNames = func.__params__;
  } else {
    paramNames = func
      .toString()
      .match(/\((.*?)\)/)![1]
      .split(",")
      .map((param) => param.trim());
    func.__params__ = paramNames;
  }

  const proxy = new Proxy(func, {
    apply(target, thisArg, args) {
      const combinedArgs = paramNames.map((paramName, index) =>
        args[index] === undefined ? defaults[paramName] : args[index]
      );

      return target.apply(thisArg, combinedArgs as T);
    },
  });

  return proxy as FunctionWithParams<Partial<T>, R>;
}

// Example usage:
function add(a: number, b: number) {
  return a + b;
}

const add2 = defaultArguments(add, { b: 9 });
console.assert(add2(10) === 19);
console.assert(add2(10, 7) === 17);
console.assert(isNaN(add2()));

const add3 = defaultArguments(add2, { b: 3, a: 2 });
console.assert(add3(10) === 13);
console.assert(add3() === 5);

const add4 = defaultArguments(add, { c: 3 });
console.assert(isNaN(add4(10)));
console.assert(add4(10, 10) === 20);

const add5 = defaultArguments(add2, { a: 10 });
console.assert(add5() === 19);
