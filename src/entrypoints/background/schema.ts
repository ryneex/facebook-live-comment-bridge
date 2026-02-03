import z from "zod"

export const ApiConfigSchema = z.object({
  url: z.string().nullable(),
  key: z.string().nullable(),
})

export type ApiConfig = z.infer<typeof ApiConfigSchema>
