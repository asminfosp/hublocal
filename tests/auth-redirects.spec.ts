import { expect, test } from "@playwright/test"
import { readFile } from "node:fs/promises"
import path from "node:path"

const root = process.cwd()

test.describe("Auth redirects and feedback", () => {
  test("login preserves protected next target", async ({ page }) => {
    await page.goto("/cadastrar-empresa")

    await expect(page).toHaveURL(/\/entrar\?/)
    expect(new URL(page.url()).searchParams.get("next")).toBe("/cadastrar-empresa")
  })

  test("auth actions redirect to account context and emit telemetry", async () => {
    const actions = await readFile(path.join(root, "app/auth/actions.ts"), "utf8")
    const callback = await readFile(path.join(root, "app/auth/callback/route.ts"), "utf8")
    const telemetry = await readFile(path.join(root, "src/application/auth-telemetry.ts"), "utf8")

    expect(actions).toContain("signInWithPasswordAction")
    expect(actions).toContain('redirect(withAuthEvent(next, "login"))')
    expect(actions).toContain('redirect("/minha-conta?auth=signup")')
    expect(actions).toContain('redirect("/?auth=logout")')
    expect(actions).toContain("password_reset")
    expect(callback).toContain("withLoginEvent")
    expect(telemetry).toContain("login_success")
    expect(telemetry).toContain("login_failed")
    expect(telemetry).toContain("signup_success")
    expect(telemetry).toContain("logout")
    expect(telemetry).toContain("password_reset")
  })
})
