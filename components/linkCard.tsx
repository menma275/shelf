import Image from "next/image";


import { IoTrashBin, IoArrowRedoSharp } from "react-icons/io5";

import deleteLinks from "@/lib/deleteLink";
import Modal from "@/components/modal";

import { useState } from "react";


export default function LinkCard({links, selectedTag, tags, fetchLinks, changeTagFunc}:{links:any, selectedTag:number, tags:any, fetchLinks:Function, changeTagFunc:Function}) {

    const [isChangeTagModalOpen, setIsChangeTagModalOpen] = useState(false)
    const [id, setId] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const deleteLink = async (id:number) => {
        await deleteLinks(id)
        await fetchLinks()
    }

    const changeTag = async (id:number, tagId:number, selectedTag:number) => {
        try{
            setIsLoading(true)
            await changeTagFunc(id, tagId, selectedTag??0)
            await fetchLinks()
        }catch(e){
            console.log(e)
        }finally{
            setIsLoading(false)
        }
    }

    const inverselinks = links.slice().reverse()
    return (
        <>
            {inverselinks &&(
            <div className="w-full pt-20 sm:pt-32 pb-36">
                <div className="grid grid-cols-2 gap-3">
                    {inverselinks.map((link:any) => {
                        const date = new Date(link.updatedAt).toLocaleDateString();
                        return(
                            <div className="relative group" key={link.id}>
                                {/* メインコンテンツ */}
                                <a href={link.url} key={link.id} className="flex flex-col bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)] overflow-hidden">
                                    <div className="w-full aspect-[2] relative overflow-hidden">
                                        {link.img ?( 
                                            <Image layout="fill" className="block" objectFit="cover" src={link.img}  alt="image" />
                                        ) : (
                                            <div className="flex justify-center items-center h-full border-b border-[var(--border)]">
                                                <p className="text-[var(--font-secondary)]">No Image</p>
                                            </div>
                                        )
                                        }
                                        <p className="absolute bottom-0 left-2 text-[0.7rem] text-[var(--font-primary)] bg-[var(--bg-secondary)] px-1.5 pt-0.5 rounded-t-lg">{date}</p>
                                    </div>
                                    <div className="p-3">
                                        <div className="flex flex-col gap-3 w-full overflow-hidden">
                                            <div className="flex flex-row gap-1.5 items-center">
                                                {link.favicon && <Image width={17} height={17} className="rounded-sm" src={link.favicon}  alt="favicon" />}
                                                <h1 className="truncate">{link.title}</h1>
                                            </div>
                                            <p className="truncate text-xs text-[var(--font-secondary)] ">{link.content}</p>
                                        </div>
                                    </div>
                                </a>
                                {/* 消去ボタン */}
                                <button onClick={()=>deleteLink(link.id)} className="text-[var(--font-secondary)] text-lg rounded-full opacity-0 group-hover:opacity-100 hover:text-[var(--font-primary)] duration-300 transition-all absolute right-3 top-3"><IoTrashBin/></button>
                                {/* 移動ボタン */}
                                <button onClick={()=>{setIsChangeTagModalOpen(true), setId(link.id)}} className="text-[var(--font-secondary)] text-lg rounded-full opacity-0 group-hover:opacity-100 hover:text-[var(--font-primary)] duration-300 transition-all absolute right-10 top-3"><IoArrowRedoSharp/></button>
                            </div>
                        )
                    }
                    )}
                </div>
            </div>
            )}
            <Modal isOpen={isChangeTagModalOpen} setIsOpen={setIsChangeTagModalOpen} title="Change Tag">
                {/* tagsの選択肢を表示 */}
                <div className="flex flex-wrap gap-2">
                    {tags && tags.map((tag:any) => {
                        return(
                        tag.id === selectedTag ?(
                            <button key={tag.id} disabled className="bg-[var(--bg-primary)] text-xs px-3 py-1 border-2 border-[var(--bg-secondary)] rounded-full text-[var(--font-secondary)]">{tag.name}</button>
                        ):(
                            <button key={tag.id} onClick={()=>changeTag(id ?? 0, tag.id, selectedTag)} className="bg-[var(--bg-primary)] text-xs px-3 py-1 border-2 border-[var(--border)] rounded-full hover:border-[var(--accent-light)]">{tag.name}</button>
                        )
                        )
                    })}
                </div>
            </Modal>
        </>
    )
}