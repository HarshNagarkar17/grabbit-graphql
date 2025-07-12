import gql from "graphql-tag";

export const itemsTypeDefs = gql`
  type Item {
    id: String!
    title: String!
    url: String!
    type: String!
    createdAt: String!
    updatedAt: String!
  }

  input ItemInput {
    title: String!
    url: String!
    type: String!
  }

  type AddResponse {
    id: String!
    title: String!
    url: String!
    type: String!
  }

  type Query {
    getUserItems: [Item!]!
  }
  type Mutation {
    add(input: ItemInput!): AddResponse!
  }
`;
