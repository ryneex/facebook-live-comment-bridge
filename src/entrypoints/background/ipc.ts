import {
  BackgroundToContentEvent,
  BackgroundToContentEventKeys,
  BackgroundToPopoverEvent,
  BackgroundToPopoverEventKeys,
  ContentToBackgroundEvent,
  ContentToBackgroundEventKeys,
  PopoverToBackgroundEvent,
  PopoverToBackgroundEventKeys,
} from "@/types"
import z from "zod"

const ContentMessageSchema = z.object({
  from: z.literal("CONTENT"),
  type: z.string<ContentToBackgroundEventKeys>(),
  data: z.any(),
})

const PopoverMessageSchema = z.object({
  from: z.literal("POPOVER"),
  type: z.string<PopoverToBackgroundEventKeys>(),
  data: z.any(),
})

type ContentCallBack<T extends ContentToBackgroundEventKeys> = (
  data: ContentToBackgroundEvent<T>,
  sender: Browser.runtime.MessageSender,
) => void

type PopoverCallBack<T extends PopoverToBackgroundEventKeys> = (
  data: PopoverToBackgroundEvent<T>,
  sender: Browser.runtime.MessageSender,
) => void

class ContentIPC {
  __events = new Map<ContentToBackgroundEventKeys, Set<Function>>()

  constructor() {
    browser.runtime.onMessage.addListener((data, sender) => {
      const result = ContentMessageSchema.safeParse(data)
      if (!result.success) return

      const events = this.__events.get(result.data.type)

      if (!events) return

      events.forEach((callback) => {
        callback(result.data.data, sender)
      })
    })
  }

  on<T extends ContentToBackgroundEventKeys>(
    event: T,
    callback: ContentCallBack<T>,
  ) {
    let set = this.__events.get(event)
    if (!set) set = new Set()
    this.__events.set(event, set)

    set.add(callback)
  }

  off<T extends ContentToBackgroundEventKeys>(
    event: T,
    callback: ContentCallBack<T>,
  ) {
    let set = this.__events.get(event)
    if (!set) set = new Set()

    set.delete(callback)
  }

  send<T extends BackgroundToContentEventKeys>(
    tabId: number,
    event: T,
    data: BackgroundToContentEvent<T>,
  ) {
    browser.tabs.sendMessage(tabId, {
      type: event,
      data,
    })
  }
}

class PopoverIPC {
  __events = new Map<PopoverToBackgroundEventKeys, Set<Function>>()

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

  on<T extends PopoverToBackgroundEventKeys>(
    event: T,
    callback: PopoverCallBack<T>,
  ) {
    let set = this.__events.get(event)
    if (!set) set = new Set()
    this.__events.set(event, set)

    set.add(callback)
  }

  off<T extends PopoverToBackgroundEventKeys>(
    event: T,
    callback: PopoverCallBack<T>,
  ) {
    let set = this.__events.get(event)
    if (!set) set = new Set()

    set.delete(callback)
  }

  send<T extends BackgroundToPopoverEventKeys>(
    event: T,
    data: BackgroundToPopoverEvent<T>,
  ) {
    browser.runtime.sendMessage({
      from: "BG_TO_POPOVER",
      type: event,
      data,
    })
  }
}

export const ipc = {
  content: new ContentIPC(),
  popover: new PopoverIPC(),
}
