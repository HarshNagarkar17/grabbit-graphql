import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RHFInput from "@/components/rhf-input";
import { useForm } from "react-hook-form";
import { signInSchema, type SignInSchema } from "@/schema/auth";
import FormProvider from "@/components/FormProvider";

const SignInPage = () => {
  const handleSubmit = (values: SignInSchema) => {
    console.log({ values });
  };

  const methods = useForm<SignInSchema>({
    mode: "onBlur",
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
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
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-600">
            Sign in to access your saved content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider methods={methods} onSubmit={handleSubmit}>
            <div className="space-y-4">
              <RHFInput
                name="email"
                id="email"
                placeholder="Enter an Email"
                label="Email"
              />
              <RHFInput
                name="password"
                id="password"
                type="password"
                placeholder="Enter a strong password"
                label="Password"
              />

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm mt-6"
              >
                Sign In
              </Button>
            </div>
          </FormProvider>

          <div className="mt-6 text-center">
            <Link
              to="/auth/signup"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors font-medium"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default SignInPage;
