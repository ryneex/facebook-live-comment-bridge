import { Comment } from "@/types/comment"

export function scrapeComments(): Comment[] {
  const commentContainerSelector =
    "div.x1n2onr6.x1cy8zhl.x9f619.x2lah0s.xjkvuk6.xv54qhq.xf7dkkf.x1iorvi4.x78zum5.x1q0g3np.x1a2a7pz"
  const commentContentSelector = "div.xv55zj0.x1vvkbs.x1rg5ohu.xxymvpz"

  const commentContainers = document.querySelectorAll(commentContainerSelector)

  const comments = Array.from(commentContainers).map(
    (commentElement): Comment => {
      const imageElement = commentElement.querySelector("image")

      const image = imageElement?.getAttribute("xlink:href")

      if (!image) throw new Error("Image not found")

      const contentElement = commentElement.querySelector<HTMLDivElement>(
        commentContentSelector,
      )

      if (!contentElement) throw new Error("Content element not found")

      const content = contentElement.innerText

      const [author, comment] = content.split("\n")

      return { image, author, comment }
    },
  )

  return comments
}
