async function feed(parent, arg, context, info) {
  const where = arg.filter
    ? {
        OR: [
          { description: { contains: arg.filter } },
          { url: { contains: arg.filter } },
        ],
      }
    : {};

  const links = await context.prisma.link.findMany({
    where,
  });
  return links;
}

export default { feed };
