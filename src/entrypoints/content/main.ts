import { ContentScriptContext } from "#imports"
import { ipc } from "./ipc"
import { scrapeComments } from "./scraper"

export function main(ctx: ContentScriptContext) {
  ipc.send("ready", {
    msg: "Hello from content",
  })

  ipc.send("comments", scrapeComments())

  setInterval(() => {
    ipc.send("comments", scrapeComments())
  }, 1000)
}
