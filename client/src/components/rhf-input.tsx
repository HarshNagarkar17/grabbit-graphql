import { Controller, useFormContext } from "react-hook-form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

type Props = {
  name: string;
  id: string;
  placeholder?: string;
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const RHFInput = ({ name, id, placeholder, label, ...rest }: Props) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label htmlFor={id} className="text-sm font-medium text-gray-700">
            {label}
          </Label>
          <Input
            {...field}
            {...rest}
            id={id}
            placeholder={placeholder}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
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
export default RHFInput;
