"use server"

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function getTags(id: number) {
    const tags = await prisma.tag.findMany({
        where: {
            authorId: id
        }
    });
    return tags;
}