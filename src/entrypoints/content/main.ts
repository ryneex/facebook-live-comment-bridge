import { ContentScriptContext } from "#imports"
import { ipc } from "./ipc"
import { scrapeComments } from "./scraper"

export function main(ctx: ContentScriptContext) {
  ipc.on("request:comments", () => {
    ipc.send("comments", scrapeComments())
  })
}
