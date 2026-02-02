import z from "zod"
import { Button } from "./components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/ui/form"
import { Input } from "./components/ui/input"
import { nonEmptyField } from "./helpers/non-empty-field"

const FormSchema = z.object({
  url: z.url().nullable(),
  key: z.string().nullable(),
})

export function App() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: null,
      key: null,
    },
  })

  useEffect(() => {
    async function setInitialValues() {
      const stored = await browser.storage.local.get("api")
      if (!stored.api) return

      const result = FormSchema.safeParse(stored.api)
      if (!result.success) return

      form.reset(result.data)
    }

    setInitialValues()
  }, [])

  function onSubmit(values: z.infer<typeof FormSchema>) {
    browser.storage.local.set({
      api: values,
    })
  }

  return (
    <div className="p-4 w-64 flex flex-col gap-4">
      <h1 className="text-lg font-bold">API Configuration</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input {...nonEmptyField(field)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key</FormLabel>
                  <FormControl>
                    <Input {...nonEmptyField(field)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Save</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
