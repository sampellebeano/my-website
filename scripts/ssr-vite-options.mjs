// These short-lived servers render source in Node; they never serve browser modules.
export function ssrViteOptions() {
  return {
    optimizeDeps: { noDiscovery: true, include: [] },
    plugins: [{
      name: 'ssr-only-no-browser-prebundle',
      configResolved(config) {
        // React SWC adds jsx-dev-runtime during config merging. Clear it after
        // plugins resolve so shutdown cannot race a browser dependency build.
        config.optimizeDeps.include = [];
      },
    }],
  };
}
