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
  type: z.string<ContentToBackgroundEventKeys>(),
  data: z.any(),
})

const PopoverMessageSchema = z.object({
  type: z.string<PopoverToBackgroundEventKeys>(),
  data: z.any(),
})

type ContentCallBack<T extends ContentToBackgroundEventKeys> = (
  data: ContentToBackgroundEvent<T>,
  port: Browser.runtime.Port,
) => void

type PopoverCallBack<T extends PopoverToBackgroundEventKeys> = (
  data: PopoverToBackgroundEvent<T>,
  port: Browser.runtime.Port,
) => void

class ContentIPC {
  __events = new Map<ContentToBackgroundEventKeys, Set<Function>>()
  __ports = new Set<Browser.runtime.Port>()

  constructor() {
    browser.runtime.onConnect.addListener((port) => {
      if (port.name !== "CONTENT") return

      if (this.__ports.size === 0) {
        console.log("New port connected")
      } else {
        console.log("New port connected. Old ports will be ignored.")
      }

      this.__ports.add(port)

      port.onMessage.addListener((data) => {
        const lastPort = Array.from(this.__ports)[this.__ports.size - 1]
        if (lastPort !== port) return

        const result = ContentMessageSchema.safeParse(data)
        if (!result.success) return

        const events = this.__events.get(result.data.type)

        if (!events) return

        events.forEach((callback) => {
          callback(result.data.data, port)
        })
      })

      port.onDisconnect.addListener((port) => {
        this.__ports.delete(port)
        console.log("Port disconnected", port.name)
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
    event: T,
    data: BackgroundToContentEvent<T>,
  ) {
    this.__ports.forEach((port) => {
      port.postMessage({
        type: event,
        data,
      })
    })
  }
}

class PopoverIPC {
  __events = new Map<PopoverToBackgroundEventKeys, Set<Function>>()
  __ports = new Set<Browser.runtime.Port>()

  constructor() {
    browser.runtime.onConnect.addListener((port) => {
      if (port.name !== "POPOVER") return
      this.__ports.add(port)

      port.onMessage.addListener((data) => {
        const result = PopoverMessageSchema.safeParse(data)
        if (!result.success) return

        const events = this.__events.get(result.data.type)

        if (!events) return

        events.forEach((callback) => {
          callback(result.data.data, port)
        })
      })

      port.onDisconnect.addListener((port) => {
        this.__ports.delete(port)
        console.log("Port disconnected", port.name)
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
    this.__ports.forEach((port) => {
      port.postMessage({
        type: event,
        data,
      })
    })
  }
}

export const ipc = {
  content: new ContentIPC(),
  popover: new PopoverIPC(),
}
