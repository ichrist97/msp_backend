const deleteOne = (Model) => async (parent, args, context, info) => {
  const doc = await Model.findByIdAndDelete(args.id);

  if (!doc) {
    throw new Error("No document found with that ID");
  }
};

export { deleteOne };
