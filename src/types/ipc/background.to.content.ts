export type BackgroundToContentEventMap = {
  "request:comments": undefined
}

export type BackgroundToContentEventKeys = keyof BackgroundToContentEventMap

export type BackgroundToContentEvent<T extends BackgroundToContentEventKeys> =
  BackgroundToContentEventMap[T]
