"use server"

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function changeTag(userId:number, id: number, tag: number) {
    const links = await prisma.post.update({
        where: { id: id },
        data: {
            tags: {
                connect: { id: tag }
            }
        }
    });
    return links;
}