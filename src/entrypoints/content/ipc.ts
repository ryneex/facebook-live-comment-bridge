import { ContentToBackgroundEvent, ContentToBackgroundEventKeys } from "@/types"
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
  sender: Browser.runtime.MessageSender,
) => void

export class IPC {
  __events = new Map<BackgroundToContentEventKeys, Set<Function>>()

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
    data: ContentToBackgroundEvent<T>,
  ) {
    browser.runtime.sendMessage({
      from: "CONTENT",
      type: event,
      data,
    })
  }
}

export const ipc = new IPC()
