export type BackgroundToContentEventMap = {}

export type BackgroundToContentEventKeys = keyof BackgroundToContentEventMap

export type BackgroundToContentEvent<T extends BackgroundToContentEventKeys> =
  BackgroundToContentEventMap[T]
