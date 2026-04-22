import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { getProjectEnvValue } from "./server/env.js";
import { createAiPlannerHandler } from "./server/aiPlannerRoute.js";

function aiPlannerApiPlugin() {
  const handler = createAiPlannerHandler({
    getApiKey: () => getProjectEnvValue(process.cwd(), "OPENAI_API_KEY")
  });

  return {
    name: "ai-planner-api",
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    }
  };
}

export default defineConfig({
  plugins: [react(), aiPlannerApiPlugin()]
});
