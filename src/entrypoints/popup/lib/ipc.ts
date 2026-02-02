import { PopoverToBackgroundEvent, PopoverToBackgroundEventKeys } from "@/types"
import {
  BackgroundToPopoverEvent,
  BackgroundToPopoverEventKeys,
} from "@/types/ipc/background.to.popover"
import z from "zod"

const PopoverMessageSchema = z.object({
  from: z.literal("BG_TO_POPOVER"),
  type: z.string<BackgroundToPopoverEventKeys>(),
  data: z.any(),
})

type CallBack<T extends BackgroundToPopoverEventKeys> = (
  data: BackgroundToPopoverEvent<T>,
  sender: Browser.runtime.MessageSender,
) => void

export class IPC {
  __events = new Map<BackgroundToPopoverEventKeys, Set<Function>>()

  constructor() {
    browser.runtime.onMessage.addListener((data, sender) => {
      const result = PopoverMessageSchema.safeParse(data)
      if (!result.success) return

      const events = this.__events.get(result.data.type)

      if (!events) return

      events.forEach((callback) => {
        callback(result.data.data, sender)
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
    data: PopoverToBackgroundEvent<T>,
  ) {
    browser.runtime.sendMessage({
      from: "POPOVER",
      type: event,
      data,
    })
  }
}

export const ipc = new IPC()
