#!/usr/bin/env node --loader ts-node/esm --experimental-specifier-resolution=node
(async () => {
  const oclif = await import('@oclif/core')
  await oclif.execute({ type: 'esm', development: true, dir: import.meta.url })
})();
