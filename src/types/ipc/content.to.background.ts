import { Comment } from "../comment"

export type ContentToBackgroundEventMap = {
  comments: Comment[]
}

export type ContentToBackgroundEventKeys = keyof ContentToBackgroundEventMap

export type ContentToBackgroundEvent<T extends ContentToBackgroundEventKeys> =
  ContentToBackgroundEventMap[T]
