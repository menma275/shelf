"use server"

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function getUser(email: string) {
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
    return user;
}