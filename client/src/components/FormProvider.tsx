import type React from "react";
import { FormProvider as RHFProvider } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";

interface Props {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  methods: UseFormReturn<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void;
}
const FormProvider = ({ children, onSubmit, methods }: Props) => {
  return (
    <RHFProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </RHFProvider>
  );
};

export default FormProvider;
