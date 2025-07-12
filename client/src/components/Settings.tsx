import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation } from "@apollo/client";
import { MeDocument, UpdateDocument } from "@/graphql/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema, type UpdateUserSchema } from "@/schema/auth";
import RHFInput from "./rhf-input";
import FormProvider from "./FormProvider";
import useUser from "@/hooks/use-user";
import { toast } from "sonner";

const Settings = () => {
  const { data } = useUser();
  const [update, { loading }] = useMutation(UpdateDocument, {
    update(cache, { data }) {
      if (data?.updateUser) {
        cache?.writeQuery({
          query: MeDocument,
          data: {
            me: data?.updateUser,
          },
        });
      }
    },
    onError(error) {
      if (error?.graphQLErrors.length)
        toast.error(error.graphQLErrors[0].message);
      else if (error.networkError) toast.error(error.networkError.message);
      else toast.error("Failed to update!");
    },
    onCompleted() {
      toast.success("Details Updated!");
    },
  });

  const methods = useForm({
    resolver: zodResolver(updateUserSchema),
    mode: "onBlur",
    defaultValues: {
      email: data?.me.email || "",
      username: data?.me.username || "",
    },
  });

  const handleSubmit = (values: UpdateUserSchema) => {
    update({
      variables: { input: { email: values.email, username: values.username } },
    });
  };
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="fade-in">
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
          Settings
        </h1>
        <p className="text-gray-600 mt-2 text-base">
          Manage your account and preferences
        </p>
      </div>

      <Card className="glass-card fade-in border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Profile
          </CardTitle>
          <CardDescription className="text-gray-600">
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormProvider methods={methods} onSubmit={handleSubmit}>
            <div className="space-y-4">
              <RHFInput
                name="email"
                id="email"
                label="Email"
                placeholder={data?.me.email || ""}
              />
              <RHFInput
                name="username"
                id="username"
                label="Username"
                placeholder={data?.me.username || ""}
              />

              <Button
                className={`bg-blue-600 hover:bg-blue-700 text-white shadow-sm ${
                  loading ? "opacity-60" : "opacity-100"
                }`}
                type="submit"
                disabled={loading}
              >
                Save Changes
              </Button>
            </div>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
