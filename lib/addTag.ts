"use server"

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function addTag(authorId: number, name:string) {
    const tags = await prisma.tag.create({
        data: {
            name: name,
            authorId: authorId
        }
    });
    return tags;
}