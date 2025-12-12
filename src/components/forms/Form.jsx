import { FormProvider } from "react-hook-form";

/**
 * Form wrapper component để sử dụng với React Hook Form
 */
export function Form({
  methods,
  onSubmit,
  onError,
  children,
  className,
  ...props
}) {
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit, onError)}
        className={className}
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
}
