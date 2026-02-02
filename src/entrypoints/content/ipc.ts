import {
  ContentToBackgroundEvent,
  ContentToBackgroundEventKeys,
  OptionalArgs,
} from "@/types"
import {
  BackgroundToContentEvent,
  BackgroundToContentEventKeys,
} from "@/types/ipc/background.to.content"
import z from "zod"

const ContentMessageSchema = z.object({
  type: z.string<BackgroundToContentEventKeys>(),
  data: z.any(),
})

type CallBack<T extends BackgroundToContentEventKeys> = (
  data: BackgroundToContentEvent<T>,
) => void

export class IPC {
  __events = new Map<BackgroundToContentEventKeys, Set<Function>>()
  __port: Browser.runtime.Port

  constructor() {
    this.__port = browser.runtime.connect({ name: "CONTENT" })

    this.__port.onMessage.addListener((data) => {
      const result = ContentMessageSchema.safeParse(data)
      if (!result.success) return

      const events = this.__events.get(result.data.type)

      if (!events) return

      events.forEach((callback) => {
        callback(result.data.data)
      })
    })
  }

  on<T extends BackgroundToContentEventKeys>(event: T, callback: CallBack<T>) {
    let set = this.__events.get(event)
    if (!set) set = new Set()
    this.__events.set(event, set)

    set.add(callback)
  }

  off<T extends BackgroundToContentEventKeys>(event: T, callback: CallBack<T>) {
    let set = this.__events.get(event)
    if (!set) set = new Set()

    set.delete(callback)
  }

  send<T extends ContentToBackgroundEventKeys>(
    event: T,
    ...args: OptionalArgs<ContentToBackgroundEvent<T>>
  ) {
    this.__port.postMessage({
      type: event,
      data: args.at(0),
    })
  }
}

export const ipc = new IPC()
