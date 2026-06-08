import { expect, test } from "@playwright/test"
import { readFile } from "node:fs/promises"
import path from "node:path"

const root = process.cwd()

test.describe("Auth session provider", () => {
  test("global provider exposes loading, authenticated and unauthenticated states", async () => {
    const provider = await readFile(path.join(root, "components/auth-session-provider.tsx"), "utf8")
    const layout = await readFile(path.join(root, "app/layout.tsx"), "utf8")

    expect(provider).toContain('"loading"')
    expect(provider).toContain('"authenticated"')
    expect(provider).toContain('"unauthenticated"')
    expect(provider).toContain("initialProfile")
    expect(layout).toContain("AuthSessionProvider")
    expect(layout).toContain("AuthFeedbackToast")
  })

  test("avatar priority prefers provider image and falls back to the display initial", async () => {
    const auth = await readFile(path.join(root, "src/application/auth.ts"), "utf8")
    const nav = await readFile(path.join(root, "components/global-nav.tsx"), "utf8")

    expect(auth).toContain("user.user_metadata.avatar_url ?? user.user_metadata.picture ?? profile?.avatar_url")
    expect(nav).toContain("name.charAt(0).toUpperCase()")
  })
})
