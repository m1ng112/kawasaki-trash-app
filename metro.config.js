const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for @ alias
config.resolver.alias = {
  '@': path.resolve(__dirname, './'),
};

module.exports = config;