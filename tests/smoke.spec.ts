import { test, expect } from "@playwright/test";

test("lesson renders with rich content", async ({ page }) => {
  page.on("pageerror", e => console.log("pageerror:", e));
  page.on("console", m => console.log(`[${m.type()}]`, m.text()));

  await page.goto("/lesson/getting-started");
  
  // Check lesson header
  await expect(page.getByText("Getting Started with AI")).toBeVisible();
  await expect(page.getByText("Your first steps into the world of artificial intelligence")).toBeVisible();
  
  // Check lesson metadata
  await expect(page.getByText("Beginner")).toBeVisible();
  await expect(page.getByText("15 min")).toBeVisible();
  await expect(page.getByText("100 XP")).toBeVisible();
  
  // Check lesson navigation
  await expect(page.getByText("What is AI?")).toBeVisible();
  await expect(page.getByText("Types of AI")).toBeVisible();
  
  // Check actual content
  await expect(page.getByText("Artificial Intelligence (AI) is the simulation")).toBeVisible();
});

test("no single-child errors on home", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(String(e)));
  await page.goto("/");
  expect(errors.join("\n")).not.toMatch(/Children\.only/);
});
