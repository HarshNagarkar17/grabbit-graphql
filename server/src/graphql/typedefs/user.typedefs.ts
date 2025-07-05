import { gql } from "graphql-tag";

export const userTypeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
  }

  type Query {
    me: User
  }
`;
