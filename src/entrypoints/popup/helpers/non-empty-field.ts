import { ChangeEvent } from "react"
import { ControllerRenderProps } from "react-hook-form"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function nonEmptyField<T extends ControllerRenderProps<any, any>>(
  field: T,
) {
  return {
    ...field,
    value: field.value ?? "",
    onChange: (e: ChangeEvent<HTMLInputElement>) =>
      field.onChange(e.target.value.trim() === "" ? null : e.target.value),
  }
}
