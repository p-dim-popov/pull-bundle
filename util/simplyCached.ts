  export const simplyCached = <Fn extends (...args: any[]) => any>(
    fn: Fn,
  ): ((...args: Parameters<Fn>) => Promise<Awaited<ReturnType<Fn>>>) => {
    const cache = new Map();
    return async (...args) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }

      const result = await fn(...args);
      cache.set(key, result);
      return result;
    };
  };
