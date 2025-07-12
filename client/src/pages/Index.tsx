import Dashboard from "@/components/Dashboard";
import useUser from "@/hooks/use-user";

const IndexPage = () => {
  const { loading, data, error } = useUser();
  console.log({ loading, data, error });

  return <Dashboard />;
};

export default IndexPage;
