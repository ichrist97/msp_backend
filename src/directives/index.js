import { gql } from "apollo-server";

const typeDefs = gql`
  directive @formatDate(format: String = "dd MMM yyy") on FIELD_DEFINITION
`;

const resolvers = {};

export default { typeDefs, resolvers };
