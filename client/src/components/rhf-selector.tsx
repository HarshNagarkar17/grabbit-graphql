import { Controller, useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "./ui/label";

type Props = {
  name: string;
  id: string;
  placeholder?: string;
  label: string;
  options: { label: string; value: string }[];
} & React.InputHTMLAttributes<HTMLInputElement>;

const RHFSelector = ({ name, label, id, placeholder, options }: Props) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label htmlFor={id} className="text-sm font-medium text-gray-700">
            {label}
          </Label>
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              id={id}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg">
              {options.map((option) => (
                <SelectItem
                  value={option.value}
                  className="hover:bg-gray-50"
                  key={option.value}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.error && (
            <p className="text-red-400 mr-auto w-fit text-sm">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
};

export default RHFSelector;
