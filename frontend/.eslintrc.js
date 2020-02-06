module.exports = {
  'env': {
    'browser': true,
    'es6': true,
  },
  'extends': [
    'google',
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'ignorePatterns': ['*pb.js', 'node_modules/', 'spec/'],
  'parser':'babel-eslint',
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module',
  },
  'rules': {
    'require-jsdoc' : 0,
    'max-len': [2, {
      code: 100,
      tabWidth: 2,
      ignoreUrls: true,
      ignoreComments: true,
      ignoreStrings: true,
      ignorePattern: '(^import\\s.+\\sfrom\\s.+;$)|(^\\s.+require.+$)',
    }],
  },
};
