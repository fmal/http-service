'use strict';

// eslint-disable-next-line import/no-commonjs
module.exports = api => {
  const env = api.env();

  let modules = true;
  let ignoreTestFiles = true;
  let envTargets = {
    browsers: ['last 2 versions', 'ie >= 11']
  };

  switch (env) {
    case 'test':
      envTargets = Object.assign({}, envTargets, {
        node: 9
      });
      ignoreTestFiles = false;
      break;
    case 'esm':
      modules = false;
      break;
    case 'cjs':
    default:
      break;
  }

  return {
    presets: [
      [
        '@babel/env',
        {
          loose: true,
          shippedProposals: true,
          modules: modules ? 'commonjs' : false,
          targets: envTargets
        }
      ]
    ],
    plugins: [modules && 'babel-plugin-add-module-exports'].filter(Boolean),
    ignore: [ignoreTestFiles && '**/__tests__'].filter(Boolean)
  };
};
