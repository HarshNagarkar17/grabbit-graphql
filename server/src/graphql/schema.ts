import { makeExecutableSchema } from "@graphql-tools/schema";
import { userTypeDefs } from "./typedefs/user.typedefs";

export const schema = makeExecutableSchema({
  typeDefs: [userTypeDefs],
  resolvers: {},
});
