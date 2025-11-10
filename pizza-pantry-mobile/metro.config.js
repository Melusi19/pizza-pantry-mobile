const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('db');
config.resolver.sourceExts.push('ts', 'tsx');

// Enable package exports
config.resolver.unstable_enablePackageExports = true;

module.exports = config;