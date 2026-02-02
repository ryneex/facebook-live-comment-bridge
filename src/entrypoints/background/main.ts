import { ipc } from "./ipc"
import { postComments } from "./helpers/post-comments"

export async function main() {
  ipc.content.on("comments", (data, port) => {
    postComments(data)
  })
}
