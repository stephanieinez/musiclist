async function feed(parent, args, context) {
  const links = await context.prisma.links({
    where: {
      OR: [{ genre_contains: args.filter }],
    },
  });
  return {
    links,
  };
}

module.exports = {
  feed,
};
