import z from "zod"
import { Button } from "./components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/ui/form"
import { Input } from "./components/ui/input"
import { nonEmptyField } from "./helpers/non-empty-field"

const FormSchema = z.object({
  url: z.url().nullable(),
  secretKey: z.string().nullable(),
})

export function App() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: null,
      secretKey: null,
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
    <div className="p-4 max-w-sm w-[90000px] flex flex-col gap-4">
      <h1 className="text-lg font-bold">API Configuration</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
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
              name="secretKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secret Key (Optional)</FormLabel>
                  <FormControl>
                    <Input {...nonEmptyField(field)} type="password" />
                  </FormControl>
                  <FormDescription>
                    This secret will be sent to the API in the header
                    "x-secret-key".
                  </FormDescription>
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
