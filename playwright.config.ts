import { defineConfig } from "@playwright/test";

export default defineConfig({
  workers: 1,
  webServer: { 
    command: "npm run build && npm run start -- -p 3000", 
    url: "http://localhost:3000",
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
    env: {
      NEXT_PUBLIC_E2E: "true"
    }
  },
  use: { 
    baseURL: "http://localhost:3000", 
    trace: "retain-on-failure", 
    video: "retain-on-failure" 
  },
  projects: [
    {
      name: "chromium",
      use: { channel: "chromium" },
    },
  ],
});
