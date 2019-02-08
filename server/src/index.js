const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');

const Query = require('./resolvers/Query');

const resolvers = {
  Query,

  Mutation: {
    post: (root, args, context) => {
      return context.prisma.createLink({
        url: args.url,
        description: args.description,
        genre: args.genre,
      });
    },

    delete: (parent, args, context, info) => {
      return context.prisma.deleteLink(
        {
          id: args.id,
        },
        info
      );
    },
  },
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { prisma },
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
