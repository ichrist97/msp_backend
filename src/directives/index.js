import { gql } from "apollo-server-express";

const typeDefs = gql`
  directive @log on FIELD_DEFINITION
  directive @formatDate(format: String = "yyyy-MM-dd HH:mm") on FIELD_DEFINITION
  directive @auth on FIELD_DEFINITION
  directive @authorization(role: Role! = ADMIN) on FIELD_DEFINITION
  directive @rest(url: String) on FIELD_DEFINITION
`;

const directives = { typeDefs };
export default directives;
