export type BackgroundToPopoverEventMap = {}

export type BackgroundToPopoverEventKeys = keyof BackgroundToPopoverEventMap

export type BackgroundToPopoverEvent<T extends BackgroundToPopoverEventKeys> =
  BackgroundToPopoverEventMap[T]
