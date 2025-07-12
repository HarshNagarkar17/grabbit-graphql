import useUser from "@/hooks/use-user";

const IndexPage = () => {
  const { loading, data, error } = useUser();

  console.log({ loading, data, error });

  return <div>Index page</div>;
};

export default IndexPage;
