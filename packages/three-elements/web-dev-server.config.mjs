import { importMapsPlugin } from "@web/dev-server-import-maps"
import { esbuildPlugin } from "@web/dev-server-esbuild"

export default {
  open: false,
  watch: true,
  nodeResolve: true,
  rootDir: "examples",
  plugins: [
    importMapsPlugin({
      inject: {
        importMap: {
          imports: { "three-elements": "/src/index.ts" }
        }
      }
    }),
    esbuildPlugin({
      ts: true,
      target: "auto"
    })
  ]
}
