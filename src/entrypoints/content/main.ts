import { ContentScriptContext } from "#imports"
import { scrapeComments } from "./scraper"

export function main(ctx: ContentScriptContext) {
  const comments = scrapeComments()
  console.log(comments)
}
