import productModule from "./product";
import categoryModule from "./category";
import authModule from "./auth";
import userModule from "./user";
import itemModule from "./items";
import komyunitiModule from "./komyuniti";

// custom directives
import directiveModule from "../directives";

import _ from "lodash";

const typeDefs = [
  productModule.typeDefs,
  categoryModule.typeDefs,
  authModule.typeDefs,
  userModule.typeDefs,
  itemModule.typeDefs,
  komyunitiModule.typeDefs,
  directiveModule.typeDefs,
];
const resolvers = _.merge(
  {},
  productModule.resolvers,
  categoryModule.resolvers,
  authModule.resolvers,
  userModule.resolvers,
  komyunitiModule.resolvers,
  itemModule.resolvers
);

export { typeDefs, resolvers };
