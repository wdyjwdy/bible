import { defineConfig } from "@rsbuild/core";
import { pluginBabel } from "@rsbuild/plugin-babel";
import { pluginSolid } from "@rsbuild/plugin-solid";

export default defineConfig({
  plugins: [
    pluginBabel({
      include: /\.(?:jsx|tsx)$/,
    }),
    pluginSolid(),
  ],
  output: {
    assetPrefix: "/bible/",
  },
  html: {
    appIcon: {
      icons: [{ src: "./src/icon.png", size: 512 }],
    },
    favicon: "./src/icon.png",
    title: "Bible",
  },
});
