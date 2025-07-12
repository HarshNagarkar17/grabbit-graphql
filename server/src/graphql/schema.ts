import { makeExecutableSchema } from "@graphql-tools/schema";
import { userTypeDefs } from "./typedefs/user.typedefs";
import { userResolvers } from "./resolvers/user.resolvers";
import { itemsTypeDefs } from "./typedefs/items.typedefs";
import { itemsResolvers } from "./resolvers/items.resolvers";

export const schema = makeExecutableSchema({
  typeDefs: [userTypeDefs, itemsTypeDefs],
  resolvers: [userResolvers, itemsResolvers],
});
