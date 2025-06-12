const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Custom resolver for reliable @ alias handling in EAS builds
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.resolver.alias = {
  '@': path.resolve(__dirname, './'),
};

// Enhanced module resolution
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;