import { Comment } from "@/types/comment"
import { ApiConfig } from "../schema"

export async function postComments(api: ApiConfig, comments: Comment[]) {
  if (!api.url) {
    console.warn("No API URL set. Ignoring comments.")
    return
  }

  try {
    const response = await fetch(api.url, {
      method: "POST",
      body: JSON.stringify(comments),
      headers: {
        "Content-Type": "application/json",
        ...(api.key ? { "x-api-key": api.key } : undefined),
      },
    })

    if (!response.ok) {
      console.error("Failed to send comments to API", response.statusText)
    }
  } catch (error) {
    console.error("Failed to send comments to API", error)
  }
}
