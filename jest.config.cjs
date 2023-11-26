module.exports = {
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },

    moduleNameMapper: {
      '\\.css$': 'identity-obj-proxy',
    },

    testEnvironment: 'jest-environment-jsdom',
  };
  