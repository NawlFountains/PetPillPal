module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      // Translates Supabase's dynamic web-imports into static code for Hermes
      'babel-plugin-transform-dynamic-import'
    ],
  };
};