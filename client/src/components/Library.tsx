import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { useGetUserItems } from "@/hooks/useGetUserItems";
import { Search, List, Plus } from "lucide-react";
import ListCard from "./item/ListCard";
import GridCard from "./item/GridCard";
import { Skeleton } from "./ui/skeleton";

const Library = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { data, loading } = useGetUserItems();
  const [sortBy, setSortBy] = useState<"name" | "date" | "type">("name");
  const [searchQuery, setSearchQuery] = useState("");

  const allItems = data?.getUserItems || [];

  const filteredItems = [...allItems]
    .filter((item) => item.title.includes(searchQuery))
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return Number(a.createdAt) - Number(b.createdAt);
        case "type":
          return a.type.localeCompare(b.type);
        case "name":
          return a.title.localeCompare(b.title);
        default:
          return a.title.localeCompare(b.title);
      }
    });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Library
          </h1>
          <p className="text-gray-600 mt-1 text-base">
            Organize and browse your saved content
          </p>
        </div>
      </div>

      {/* <Breadcrumb>
          <BreadcrumbList>
            {getBreadcrumbPath().map((crumb, index) => (
              <div key={crumb.id || 'root'} className="flex items-center">
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {index === getBreadcrumbPath().length - 1 ? (
                    <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink 
                      className="cursor-pointer hover:text-blue-600"
                      onClick={() => setCurrentFolder(crumb.id)}
                    >
                      {crumb.name}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb> */}

      <div className="flex items-center justify-between gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "name" | "date" | "type")
            }
            className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Sort by Name</option>
            <option value="date">Sort by Date</option>
            <option value="type">Sort by Type</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            <List className="h-4 w-4" />
          </Button>

          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      <div
        className={`grid gap-4 ${
          viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            : "grid-cols-1"
        }`}
      >
        {loading &&
          (viewMode === "grid" ? (
            <div className="bg-white border-gray-200 p-2">
              <div className="flex items-center justify-between mb-3">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <div className="mt-auto pt-2">
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border-gray-200">
              <div className="flex-shrink-0">
                <Skeleton className="h-5 w-5 rounded" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-12 rounded-full" />
                </div>
                <Skeleton className="h-3 w-40" />
              </div>
              <div className="flex-shrink-0 text-xs text-gray-400">
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        {filteredItems.map((item) => (
          <div
            key={item.id}
            //   onClick={() => handleItemClick(item)}
            className={`group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:border-gray-300 ${
              viewMode === "grid"
                ? "p-4 aspect-square flex flex-col"
                : "p-4 flex items-center gap-4"
            }`}
          >
            {viewMode === "grid" ? (
              <GridCard item={item} key={item.id} />
            ) : (
              <ListCard item={item} key={item.id} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
