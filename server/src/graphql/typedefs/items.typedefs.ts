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

  input AddPayload {
    item: ItemInput!
  }

  type AddResponse {
    id: String!
    title: String!
    url: String!
    type: String!
  }

  type Mutation {
    add(input: AddPayload!): AddResponse!
  }
`;
