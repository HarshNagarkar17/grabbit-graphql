import gql from "graphql-tag";

export const itemsTypeDefs = gql`
  type Item {
    title: String!
    url: String!
    type: String!
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
    getUserItems: [Item]!
  }
  type Mutation {
    add(input: ItemInput!): AddResponse!
  }
`;
