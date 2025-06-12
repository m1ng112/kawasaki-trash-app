const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Path aliases are now handled by tsconfigPaths experiment
// Remove manual alias configuration to avoid conflicts

module.exports = config;