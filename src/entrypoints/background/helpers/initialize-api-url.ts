import { ApiConfig, ApiConfigSchema } from "../schema"

export async function initializeApiConfig() {
  const api: ApiConfig = {
    url: null,
    key: null,
  }

  const stored = await browser.storage.local.get("api")
  if (stored.api) {
    const result = ApiConfigSchema.safeParse(stored.api)
    if (result.success) {
      api.url = result.data.url
      api.key = result.data.key
    }
  }

  browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local" || !changes.api) return

    const result = ApiConfigSchema.safeParse(changes.api.newValue)
    if (!result.success) return

    api.url = result.data.url
    api.key = result.data.key
  })

  return api
}
