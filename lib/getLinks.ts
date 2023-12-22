"use server"

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function getLinks(id: number, tag:number) {
    if(tag===null){
        const links = await prisma.post.findMany({
            where: {
                authorId: id,
            },
        });
        return links;
    }else{
        const links = await prisma.post.findMany({
            where: {
                authorId: id,
                tags: {
                    some: {
                        id: tag,
                    },
                },
            },
        });
        return links;
    }
}