module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Keep these if you're actually using them
      ['babel-plugin-lodash'], // Only if using lodash
      'react-native-reanimated/plugin', // Only if using Reanimated
      ['@babel/plugin-proposal-decorators', { legacy: true }], // Only if using decorators
      
      // Add this single instance of the class properties plugin
      ['@babel/plugin-proposal-class-properties', { loose: true }]
    ],
  };
};