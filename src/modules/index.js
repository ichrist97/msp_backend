import authModule from "./auth";
import userModule from "./user";
import komyunitiModule from "./komyuniti";
import eventModule from "./event";
import chatModule from "./chat";

// custom directives
import directiveModule from "../directives";

import _ from "lodash";

const typeDefs = [
  authModule.typeDefs,
  userModule.typeDefs,
  komyunitiModule.typeDefs,
  eventModule.typeDefs,
  directiveModule.typeDefs,
  chatModule.typeDefs,
];
const resolvers = _.merge(
  {},
  authModule.resolvers,
  userModule.resolvers,
  komyunitiModule.resolvers,
  eventModule.resolvers,
  chatModule.resolvers
);

export { typeDefs, resolvers };
