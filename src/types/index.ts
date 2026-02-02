export * from "./ipc"

export type OptionalArgs<T> = T extends undefined ? [] : [T]
