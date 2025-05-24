module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],  // Changed from metro-react-native-babel-preset
    plugins: [
      // Required: Add the proper lodash plugin
      ['babel-plugin-lodash'],
      
      // Optional: For Reanimated (if used)
      'react-native-reanimated/plugin',

      // Optional: For class properties or decorators (if needed)
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
    ],
  };
};