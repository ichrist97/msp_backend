import { SchemaDirectiveVisitor } from "apollo-server";
import { defaultFieldResolver, GraphQLString } from "graphql";
import { formatDate } from "../utils";

class LogDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver;
    field.resolve = (args) => {
      console.log("hi");
      return resolver.apply(this, args);
    };
  }
}

class FormatDateDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver;
    const { format } = this.args;

    field.resolve = async (...args) => {
      // custom resolver could be async thats why await is needed
      const result = await resolver.apply(this, args);
      return formatDate(result, format);
    };

    field.type = GraphQLString;
  }
}

export { LogDirective, FormatDateDirective };
