"use server"

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function deleteLinks(id:number) {
    const links = await prisma.post.deleteMany({
        where: {
            id: id
        }
    });
    return links;
}