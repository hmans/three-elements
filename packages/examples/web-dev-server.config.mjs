import { esbuildPlugin } from "@web/dev-server-esbuild"

export default {
  open: false,
  watch: true,
  nodeResolve: true,
  rootDir: "public",
  plugins: [
    // importMapsPlugin({
    //   inject: {
    //     importMap: {
    //       imports: { "three-elements": "../three-elements/src/index.ts" }
    //     }
    //   }
    // }),
    esbuildPlugin({
      ts: true,
      target: "auto"
    })
  ]
}
