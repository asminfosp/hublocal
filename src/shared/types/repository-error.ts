export type RepositoryErrorCode =
  | "not_found"
  | "validation"
  | "conflict"
  | "unauthorized"
  | "unavailable"

export class RepositoryError extends Error {
  constructor(
    public readonly code: RepositoryErrorCode,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message)
    this.name = "RepositoryError"
  }
}
