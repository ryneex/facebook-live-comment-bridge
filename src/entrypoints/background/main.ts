import { ipc } from "./ipc"
import { postComments } from "./helpers/post-comments"

export async function main() {
  setInterval(() => {
    ipc.content.send("request:comments")
  }, 1000)

  ipc.content.on("comments", (data) => {
    postComments(data)
  })
}
