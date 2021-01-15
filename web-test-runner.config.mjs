import { esbuildPlugin } from "@web/dev-server-esbuild"

export default {
  files: ["test"],
  nodeResolve: true,
  esbuildTarget: "auto",
  plugins: [esbuildPlugin({ ts: true })]
}
