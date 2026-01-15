import { test, expect } from "@playwright/test";
import { loginZoneSecure } from "./utils/login.js";
import { runSequence } from "./utils/sequence.js";

import dotenv from "dotenv";

dotenv.config();

test.describe("Zone sécurisée E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("nav-secure").click();
    await loginZoneSecure(page, USER, PASS);