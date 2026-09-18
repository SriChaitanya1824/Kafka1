import { test, expect } from "@playwright/test";
test.describe("dashboard routes", () => {
  test("registration page renders", async ({ page }) => { await page.goto("/register"); await expect(page.getByTestId("submit")).toBeVisible(); });
  test("login page renders", async ({ page }) => { await page.goto("/login"); await expect(page.getByTestId("email")).toBeVisible(); });
  for (const path of ["/dashboard","/templates","/templates/new","/workflows","/workflows/new","/notifications","/analytics","/preferences","/providers","/settings"]) {
    test(`${path} renders shell`, async ({ page }) => { await page.goto(path); await expect(page.getByText("Notification Platform")).toBeVisible(); });
  }
  test("template form controls exist", async ({ page }) => { await page.goto("/templates"); await expect(page.getByTestId("template-name")).toBeVisible(); await expect(page.getByTestId("save-template")).toBeVisible(); });
  test("workflow form controls exist", async ({ page }) => { await page.goto("/workflows"); await expect(page.getByTestId("workflow-name")).toBeVisible(); await expect(page.getByTestId("save-workflow")).toBeVisible(); });
  test("notification detail route renders", async ({ page }) => { await page.goto("/notifications/000000000000000000000000"); await expect(page.getByText("Notification Detail")).toBeVisible(); });
});
