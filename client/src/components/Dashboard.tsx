import { useGetUserItems } from "@/hooks/useGetUserItems";
import LongItemCard from "./item/LongItemCard";
import ItemStatCard from "./item/ItemStatCard";
import { Skeleton } from "./ui/skeleton";

const Dashboard = () => {
  const { data, loading } = useGetUserItems();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="fade-in">
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-2 text-base">
          Your saved developer content and resources
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 fade-in">
        <ItemStatCard
          name="Total Items"
          count={data?.getUserItems?.length || 0}
          loading={loading}
        />
        <ItemStatCard
          name="Articles"
          count={
            data?.getUserItems?.filter((item) => item.type === "blog").length ||
            0
          }
          loading={loading}
        />
        <ItemStatCard
          name="Repositories"
          count={
            data?.getUserItems?.filter((item) => item.type === "github")
              .length || 0
          }
          loading={loading}
        />
        <ItemStatCard
          name="Notes"
          count={
            data?.getUserItems?.filter((item) => item.type === "text").length ||
            0
          }
          loading={loading}
        />
      </div>

      {/* Content Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Recent Content</h2>
        <div className="space-y-3">
          {loading && (
            <div
              className="content-card p-6 fade-in group"
              style={{ animationDelay: `$1s` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1 min-w-0">
                  <Skeleton className="h-5 w-5 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-12" />
                    </div>
                    <Skeleton className="h-4 w-full mb-3" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {data?.getUserItems.map((item, index) => (
            <LongItemCard index={index} key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
