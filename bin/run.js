#!/usr/bin/env node

process.env.NODE_ENV = 'production';

(async () => {
  const oclif = await import('@oclif/core')
  await oclif.execute({ type: 'esm', dir: import.meta.url })
})();
