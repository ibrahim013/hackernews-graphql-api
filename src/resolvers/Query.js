function feed(parent, arg, context, info) {
  return context.prisma.link.findMany();
}

export default { feed };
