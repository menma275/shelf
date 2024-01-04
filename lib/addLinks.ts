"use server"

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const apiKey = process.env.NEXT_PUBLIC_JSON_LINK_API_KEY;

const getMetaDetails = async (url:string) => {
    const apiUrl = `https://jsonlink.io/api/extract?url=${url}&api_key=${apiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

async function escapeString(str:string) {
    return str.replace(/[\\]/g, '\\\\')
              .replace(/[\"]/g, '\\"')
              .replace(/[\/]/g, '\\/')
              .replace(/[\b]/g, '\\b')
              .replace(/[\f]/g, '\\f')
              .replace(/[\n]/g, '\\n')
              .replace(/[\r]/g, '\\r')
              .replace(/[\t]/g, '\\t')
              .replace(/[\p{Emoji}]/gu, "");
}

async function removeInvalidHexEscape(str:string) {
    const replace = str.replace(/\\x[\da-fA-F]?($|[^0-9a-fA-F])/g, '$1');
    const escape = escapeString(replace);
    if(escape === null) return "Not Valid Title";
    return escape;
}

function cutString(str:string, isCut:boolean = false) {
    if(str.length > 300){
        if(isCut)
            return str.slice(0, 300);
        else
            return "";
    }else
        return str;
}

export default async function addLinks(userId:number, tag:number, url:string) {
    const data = await getMetaDetails(url);
    console.log(data);

    const title = cutString(await removeInvalidHexEscape(data.title ?? ''));
    const description = cutString(await removeInvalidHexEscape(data.description ?? ""));
    const favicon = cutString(data.favicon ?? "");
    const img = cutString(data.images[0] ?? "");

    const links = await prisma.post.create({
        data: {
            url: url,
            title: title,
            content: description,
            favicon: favicon,
            img: img,
            authorId: userId,
            tags: {
                connect: {
                    id: tag ?? null,
                },
            },
        },
    });
    return links;
}