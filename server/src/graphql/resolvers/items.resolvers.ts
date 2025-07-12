import prisma from "@/database/prisma";
import { handleError } from "@/utils/errors";

export const itemsResolvers = {
  Mutation: {
    add: async (
      _: any,
      args: { input: { title: string; url: string; type: string } },
      context: { user: { id: string } }
    ) => {
      try {
        const { title, type, url } = args.input;
        const item = await prisma.item.create({
          data: { title, url, type, userId: context.user.id },
        });
        const { userId, ...itemWithoutUser } = item;
        return itemWithoutUser;
      } catch (error) {
        return handleError(error);
      }
    },
  },
  Query: {
    getUserItems: async (
      _: any,
      __: any,
      context: { user: { id: string } }
    ) => {
      try {
        const items = await prisma.item.findMany({
          where: {
            userId: context.user.id,
          },
        });
        return items;
      } catch (error) {
        return handleError(error);
      }
    },
  },
};
