function newLinkSubscribe(parent, arg, context, info) {
  return context.pubsub.asyncIterator("NEW_LINK");
}

const newLink = {
  subscribe: newLinkSubscribe,
  resolve: (payload) => payload,
};

function newVoteSubscribe(parent, arg, context, info) {
  return context.pubsub.asyncIterator("NEW_VOTE");
}

const newVote = {
  subscribe: newVoteSubscribe,
  resolve: (payload) => payload,
};

export default { newLink, newVote };
