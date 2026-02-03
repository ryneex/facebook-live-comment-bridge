import { ApiConfig, ApiConfigSchema } from "../schema"

export async function getApiConfig() {
  const emptyConfig: ApiConfig = {
    url: null,
    key: null,
  }

  const stored = await browser.storage.local.get("api")
  if (!stored.api) return emptyConfig

  const result = ApiConfigSchema.safeParse(stored.api)
  if (!result.success) return emptyConfig

  return result.data
}
