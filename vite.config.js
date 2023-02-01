export default {
    build: {
        rollupOptions: {
          output: {
            entryFileNames: `[name].js`,
            assetFileNames: `[name].[ext]`
          }
        }
      }
}