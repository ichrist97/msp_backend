import { gql } from "apollo-server";

const typeDefs = gql`
  directive @log on FIELD_DEFINITION
  directive @formatDate(format: String = "dd MMM yyy") on FIELD_DEFINITION
`;

const directives = { typeDefs };
export default directives;
