export type AuthTelemetryEvent =
  | "login_success"
  | "login_failed"
  | "signup_success"
  | "logout"
  | "password_reset"

export function recordAuthEvent(event: AuthTelemetryEvent, metadata: Record<string, string | boolean> = {}) {
  if (process.env.NODE_ENV !== "production") {
    console.info("[auth-telemetry]", event, metadata)
  }
}
