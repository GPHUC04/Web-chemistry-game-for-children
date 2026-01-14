import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const processEnv = Object.keys(env)
    .filter((key) => key.startsWith("VITE_"))
    .reduce((acc, key) => {
      const newKey = key.replace(/^VITE_/, "");
      acc[`process.env.${newKey}`] = JSON.stringify(env[key]);
      return acc;
    }, {});

  return {
    plugins: [vue()],
    define: processEnv,
    server: {
      proxy: {
        "/": {
          target: "https://ct313hm01-project-gphuc04.onrender.com",
          changeOrigin: true,
          rewrite: (path) => path,
        },
      },
    },
  };
});
