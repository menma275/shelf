"use server"

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function deleteTag(tag: number) {
    const tags = await prisma.tag.delete({
        where: {
            id: tag
        }
    })
    return tags;
}