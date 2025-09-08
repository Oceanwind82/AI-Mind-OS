import { test, expect } from "@playwright/test";

test("lesson renders", async ({ page }) => {
  page.on("pageerror", e => console.log("pageerror:", e));
  page.on("console", m => console.log(`[${m.type()}]`, m.text()));

  await page.goto("/lesson/getting-started");     // a static page you control
  await expect(page.getByText(/Step\s*1/i)).toBeVisible();
});

test("no single-child errors on home", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(String(e)));
  await page.goto("/");
  expect(errors.join("\n")).not.toMatch(/Children\.only/);
});
