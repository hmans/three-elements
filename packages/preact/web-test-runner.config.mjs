import { importMapsPlugin } from "@web/dev-server-import-maps"
import { esbuildPlugin } from "@web/dev-server-esbuild"

export default {
  files: ["test/**/*.test.ts"],
  nodeResolve: true,
  debug: false,
  watch: false,
  open: false,
  plugins: [
    importMapsPlugin(),
    esbuildPlugin({
      ts: true,
      target: "auto"
    })
  ]
}
