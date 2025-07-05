import { gql } from "graphql-tag";

export const userTypeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
  }

  type PublicUser {
    id: ID!
    username: String!
    email: String!
  }

  type Tokens {
    accessToken: String!
    refreshToken: String!
  }

  input AuthPayload {
    email: String!
    username: String!
    password: String!
  }

  input LoginPayload {
    email: String!
    password: String!
  }

  type LoginResponse {
    user: PublicUser!
    tokens: Tokens!
  }

  type AuthResponse {
    user: PublicUser!
    tokens: Tokens!
  }

  type Query {
    me: User
  }

  type Mutation {
    createUser(input: AuthPayload!): AuthResponse!
    login(input: LoginPayload!): LoginResponse!
  }
`;
