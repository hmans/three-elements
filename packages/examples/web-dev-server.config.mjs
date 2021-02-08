import { esbuildPlugin } from "@web/dev-server-esbuild"
import { importMapsPlugin } from "@web/dev-server-import-maps"

export default {
  open: false,
  watch: true,
  nodeResolve: true,
  rootDir: "public",
  plugins: [
    importMapsPlugin({
      inject: {
        importMap: {
          imports: {
            "three-elements": "/__wds-outside-root__/2/three-elements/src/index.ts",
            "@three-elements/loaders": "/__wds-outside-root__/2/loaders/src/index.ts",
            "@three-elements/proxy": "/__wds-outside-root__/2/proxy/src/index.ts",
            "@three-elements/preact": "/__wds-outside-root__/2/preact/src/index.ts",
            "@three-elements/text": "/__wds-outside-root__/2/text/src/index.ts"
          }
        }
      }
    }),
    esbuildPlugin({
      ts: true,
      target: "auto"
    })
  ]
}
