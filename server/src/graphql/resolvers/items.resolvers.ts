import prisma from "@/database/prisma";
import { handleError } from "@/utils/errors";

export const itemsResolvers = {
  Mutation: {
    add: async (
      _: any,
      args: { item: { title: string; url: string; type: string } },
      context: { user: { id: string } }
    ) => {
      try {
        const { title, type, url } = args.item;
        const item = await prisma.item.create({
          data: { title, url, type, userId: context.user.id },
        });
        const { userId, ...itemWithoutUser } = item;
        return { item: itemWithoutUser };
      } catch (error) {
        return handleError(error);
      }
    },
  },
};
