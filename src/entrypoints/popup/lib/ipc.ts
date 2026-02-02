import {
  OptionalArgs,
  PopoverToBackgroundEvent,
  PopoverToBackgroundEventKeys,
} from "@/types"
import {
  BackgroundToPopoverEvent,
  BackgroundToPopoverEventKeys,
} from "@/types/ipc/background.to.popover"
import z from "zod"

const PopoverMessageSchema = z.object({
  type: z.string<BackgroundToPopoverEventKeys>(),
  data: z.any(),
})

type CallBack<T extends BackgroundToPopoverEventKeys> = (
  data: BackgroundToPopoverEvent<T>,
) => void

export class IPC {
  __events = new Map<BackgroundToPopoverEventKeys, Set<Function>>()
  __port: Browser.runtime.Port

  constructor() {
    this.__port = browser.runtime.connect({
      name: "POPOVER",
    })

    this.__port.onMessage.addListener((data) => {
      const result = PopoverMessageSchema.safeParse(data)
      if (!result.success) return

      const events = this.__events.get(result.data.type)

      if (!events) return

      events.forEach((callback) => {
        callback(result.data.data)
      })
    })
  }

  on<T extends BackgroundToPopoverEventKeys>(event: T, callback: CallBack<T>) {
    let set = this.__events.get(event)
    if (!set) set = new Set()
    this.__events.set(event, set)

    set.add(callback)
  }

  off<T extends BackgroundToPopoverEventKeys>(event: T, callback: CallBack<T>) {
    let set = this.__events.get(event)
    if (!set) set = new Set()

    set.delete(callback)
  }

  send<T extends PopoverToBackgroundEventKeys>(
    event: T,
    ...args: OptionalArgs<PopoverToBackgroundEvent<T>>
  ) {
    this.__port.postMessage({
      type: event,
      data: args.at(0),
    })
  }
}

export const ipc = new IPC()
