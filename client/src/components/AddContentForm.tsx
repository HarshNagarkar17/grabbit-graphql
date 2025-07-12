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
import { contentSchema, type ContentSchema } from "@/schema/content";
import FormProvider from "./FormProvider";
import RHFInput from "./rhf-input";
import RHFSelector from "./rhf-selector";
import { useMutation } from "@apollo/client";
import { AddDocument, UserItemsDocument } from "@/graphql/types";
import { toast } from "sonner";

const AddContentForm = () => {
  const methods = useForm<ContentSchema>({
    resolver: zodResolver(contentSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      url: "",
      contentType: "",
    },
  });
  const { reset } = methods;
  const [add, { loading }] = useMutation(AddDocument, {
    update(cache, { data }) {
      if (data?.add) {
        const cachedItems = cache?.readQuery({ query: UserItemsDocument });

        if (cachedItems) {
          const newItem = {
            __typename: "Item" as const,
            id: data.add.id,
            title: data.add.title,
            type: data.add.type,
            url: data.add.url,
            createdAt: data.add.createdAt,
            updatedAt: data.add.updatedAt,
          };

          cache.writeQuery({
            query: UserItemsDocument,
            data: {
              getUserItems: [...cachedItems.getUserItems, newItem],
            },
          });
        }
      }
    },
    onError(error) {
      if (error.graphQLErrors.length)
        toast.error(error.graphQLErrors[0].message);
      else if (error.networkError) toast.error(error.networkError.message);
      else toast.error("Failed to create item!");
    },
    onCompleted() {
      toast.success("Item added!");
      reset();
    },
  });

  const handleSubmit = (values: ContentSchema) => {
    add({
      variables: {
        input: {
          title: values.title,
          type: values.contentType,
          url: values.url,
        },
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="fade-in">
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
          Add Content
        </h1>
        <p className="text-gray-600 mt-2 text-base">
          Save new developer content to your collection
        </p>
      </div>

      <Card className="glass-card fade-in border-0 shadow-lg">
        <CardHeader className="pb-6">
          <CardTitle className="text-xl font-semibold text-gray-900">
            New Content
          </CardTitle>
          <CardDescription className="text-gray-600">
            Add a title, select the content type, and provide the content or URL
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider methods={methods} onSubmit={handleSubmit}>
            <div className="space-y-4">
              <RHFInput name="title" id="title" label="Title" />

              <RHFSelector
                name="contentType"
                id="content"
                label="Content Type"
                options={[
                  { label: "Article", value: "article" },
                  { label: "Video", value: "video" },
                  { label: "Note", value: "note" },
                ]}
                placeholder="Select Content Type"
              />

              <RHFInput name="url" id="url" label="Url" />

              <div className="flex space-x-3 pt-4">
                <Button
                  type="submit"
                  className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer ${
                    loading ? "opacity-60" : "opacity-100"
                  }`}
                  disabled={loading}
                >
                  Save Content
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                  onClick={() => reset()}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddContentForm;
