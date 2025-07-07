import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpSchema } from "@/schema/auth";
import FormProvider from "@/components/FormProvider";
import RHFInput from "@/components/rhf-input";

const SignUpPage = () => {
  const handleSubmit = (values: SignUpSchema) => {
    console.log({ values });
  };

  const methods = useForm<SignUpSchema>({
    mode: "onBlur",
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  return (
    <>
      <div className="text-center fade-in">
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
          DevSave
        </h1>
        <p className="text-gray-600 mt-3 text-base">
          Save and organize your developer content
        </p>
      </div>

      <Card className="glass-card fade-in border-0 shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Create Account
          </CardTitle>
          <CardDescription className="text-gray-600">
            Start saving your developer content today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider methods={methods} onSubmit={handleSubmit}>
            <div className="space-y-4">
              <RHFInput
                name="username"
                id="username"
                label="Username"
                placeholder="Enter username"
              />

              <RHFInput
                name="email"
                id="email"
                label="Email"
                placeholder="Enter an Email"
              />

              <RHFInput
                name="password"
                id="password"
                label="Password"
                type="password"
                placeholder="Enter a strong password"
              />

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm mt-6"
              >
                Create Account
              </Button>
            </div>
          </FormProvider>

          <div className="mt-6 text-center">
            <Link
              to="/auth/signin"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors font-medium"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default SignUpPage;
