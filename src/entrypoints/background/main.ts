import { ipc } from "./ipc"
import { postComments } from "./helpers/post-comments"

export async function main() {
  const tabs = new Set<number>()

  ipc.content.on("ready", (_, sender) => {
    if (tabs.size === 0) {
      console.log("Tab connected")
    } else {
      console.log("New tab connected. Old tabs will be ignored.")
    }

    tabs.add(sender.tab?.id!)
  })

  ipc.content.on("comments", (data, sender) => {
    const lastTabId = Array.from(tabs)[tabs.size - 1]
    if (lastTabId !== sender.tab?.id) return

    postComments(data)
  })

  browser.tabs.onRemoved.addListener((tabId) => {
    if (!tabs.has(tabId)) return

    console.log("Tab removed", tabId)
    tabs.delete(tabId)
  })
}
