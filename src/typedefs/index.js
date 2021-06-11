import gql from "graphql-tag";

export default gql`
  enum Theme {
    DARK
    LIGHT
  }
  enum Role {
    ADMIN
    MEMBER
    GUEST
  }

  type Post {
    name: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    verified: Boolean!
    createdAt: String!
    role: Role!
    password: String!
  }
  type AuthUser {
    token: String!
    user: User!
  }

  type Invite {
    email: String!
    from: User!
    createdAt: String!
    role: Role!
  }

  input UpdateUserInput {
    email: String
    avatar: String
    verified: Boolean
  }
  input InviteInput {
    email: String!
    role: Role!
  }
  input SignupInput {
    email: String!
    password: String!
    role: Role!
  }
  input SigninInput {
    email: String!
    password: String!
  }
  type Query {
    me: User!
    post: Post!
  }
  type Mutation {
    updateMe(input: UpdateUserInput!): User
    invite(input: InviteInput!): Invite!
    signup(input: SignupInput!): AuthUser!
    signin(input: SigninInput!): AuthUser!
    createPost(name: String!): Post
  }
`;
