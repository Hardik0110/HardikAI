import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RequiredNumberInputProps, TextInputProps, OptionalNumberInputProps } from "@/lib/types";

export const OptionalNumberInput = ({ control, name, label, placeholder = "Optional" }: OptionalNumberInputProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input
            className="border-b"
            type="number"
            placeholder={placeholder}
            value={field.value ?? ""}
            onChange={(e) => field.onChange(e.target.value === "" ? null : parseFloat(e.target.value))}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
)

export const RequiredNumberInput = ({ control, name, label, placeholder }: RequiredNumberInputProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input
            className="border-b"
            type="number"
            placeholder={placeholder}
            value={field.value}
            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export const TextInput = ({ control, name, label, placeholder, isTextarea = false }: TextInputProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          {isTextarea ? (
            <Textarea className="border-b" placeholder={placeholder} {...field} />
          ) : (
            <Input className="border-b" placeholder={placeholder} {...field} />
          )}
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);