import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { APP_SECRET } from "../utils.js";

export async function post(parent, arg, context, info) {
  const { userId } = context;
  const newLink = await context.prisma.link.create({
    data: {
      description: arg.description,
      url: arg.url,
      postedBy: { connect: { id: userId } },
    },
  });
  context.pubsub.publish("NEW_LINK", newLink);

  return newLink;
}

export async function signup(parent, arg, context, info) {
  const password = await bcrypt.hash(arg.password, 10);

  const user = await context.prisma.user.create({
    data: {
      ...arg,
      password,
    },
  });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

export async function login(parent, arg, context, info) {
  const user = await context.prisma.user.findUnique({
    where: { email: arg.email },
  });
  if (!user) {
    throw new Error("User not found");
  }
  const valid = await bcrypt.compare(arg.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

export async function vote(parent, arg, context, info) {
  const { userId } = context;

  const vote = await context.prisma.vote.findUnique({
    where: {
      linkId_userId: {
        linkId: +arg.linkId,
        userId: userId,
      },
    },
  });

  if (Boolean(vote)) {
    throw new Error(`Already voted for link ${arg.linkId}`);
  }

  const newVote = context.prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: Number(arg.linkId) } },
    },
  });
  context.pubsub.publish("NEW_VOTE", newVote);

  return newVote;
}
export default { post, signup, login, vote };
