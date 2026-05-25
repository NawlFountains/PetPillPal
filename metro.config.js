const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Tell Metro to map the missing web telemetry package to an empty module 
// instead of crashing the native Android bundler
config.resolver.emptyModulesProxy = '@opentelemetry/api';

module.exports = withNativeWind(config, { input: './global.css' });