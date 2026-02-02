export type PopoverToBackgroundEventMap = {}

export type PopoverToBackgroundEventKeys = keyof PopoverToBackgroundEventMap

export type PopoverToBackgroundEvent<T extends PopoverToBackgroundEventKeys> =
  PopoverToBackgroundEventMap[T]
