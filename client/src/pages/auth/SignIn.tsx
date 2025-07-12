import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
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
import { useMutation } from "@apollo/client";
import { LoginDocument } from "@/graphql/types";
import { toast } from "sonner";
import { setItem } from "@/services/local-storage";
import { LOCALSTORAGE_KEYS, ROUTES } from "@/constants";

const SignInPage = () => {
  const navigate = useNavigate();
  const [login, { loading }] = useMutation(LoginDocument, {
    onError(error) {
      if (error.graphQLErrors.length)
        toast.error(error.graphQLErrors[0].message);
      else if (error.networkError?.message)
        toast.error(error.networkError.message);
      else toast.error("Failed to login!");
    },
    onCompleted(data) {
      if (data.login.tokens) {
        const { accessToken, refreshToken } = data.login.tokens;
        setItem(LOCALSTORAGE_KEYS.AUTH.ACCESS_TOKEN, accessToken);
        setItem(LOCALSTORAGE_KEYS.AUTH.REFRESH_TOKEN, refreshToken);
        toast.success("Logged In!");
        navigate(ROUTES.INDEX);
      }
    },
  });
  const handleSubmit = (values: SignInSchema) => {
    login({
      variables: {
        input: { email: values.email, password: values.password },
      },
    });
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
          Grabbit
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
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm mt-6 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
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
