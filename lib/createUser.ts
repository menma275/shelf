"use server"

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function createUser(email: string, name:string){
    const user = await prisma.user.create({
        data: {
            email: email,
            name: name,
        },
    });
    return user;
}