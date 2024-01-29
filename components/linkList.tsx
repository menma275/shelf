import Image from "next/image";

import img from "@/public/empty.png";

import { IoTrashBin, IoArrowRedoSharp } from "react-icons/io5";

import deleteLinks from "@/lib/deleteLink";
import Modal from "@/components/modal";

import { useState } from "react";
import {Oval} from "react-loader-spinner";

export default function LinkList({links, selectedTag, tags, fetchLinks, changeTagFunc}:{links:any, selectedTag:number, tags:any, fetchLinks:Function, changeTagFunc:Function}) {

    const [isChangeTagModalOpen, setIsChangeTagModalOpen] = useState(false)
    const [id, setId] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const deleteLink = async (id:number) => {
        await deleteLinks(id)
        await fetchLinks()
        setIsChangeTagModalOpen(false)
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
            {isLoading ? (
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                    <Oval color={
                        "var(--font-primary)"
                    } secondaryColor={"var(--font-secondary"} height={50} width={50} />
                </div>
            ):(
                <>
                    {inverselinks && (
                        <div className="flex flex-col justify-center pt-20 sm:pt-32 pb-36 gap-3 w-full h-full">
                            {inverselinks.map((link:any) => {
                                const date = new Date(link.updatedAt).toLocaleDateString();
                                return(
                                    <div className="relative group" key={link.id}>
                                        {/* 消去ボタン */}
                                        <button onClick={()=>deleteLink(link.id)} className="text-[var(--font-secondary)] text-lg rounded-full opacity-0 group-hover:opacity-100 hover:text-[var(--font-primary)] duration-300 transition-all absolute right-3 top-3"><IoTrashBin/></button>
                                        {/* 移動ボタン */}
                                        <button onClick={()=>{setIsChangeTagModalOpen(true), setId(link.id)}} className="text-[var(--font-secondary)] text-lg rounded-full opacity-0 group-hover:opacity-100 hover:text-[var(--font-primary)] duration-300 transition-all absolute right-10 top-3"><IoArrowRedoSharp/></button>
                                        {/* メインコンテンツ */}
                                        <a href={link.url} key={link.id} className="flex flex-col gap-2 bg-[var(--bg-secondary)] p-3 rounded-lg border border-[var(--border)]">
                                            {/* ファビコン */}
                                                <p className="truncate text-xs text-[var(--font-secondary)]">{date}</p>
                                            <div className="flex flex-col gap-3 w-full overflow-hidden">
                                                <div className="flex flex-row gap-1.5 items-center">
                                                    {link.favicon && <Image width={17} height={17} className="rounded-sm" src={link.favicon}  alt="favicon" />}
                                                    <h1 className="truncate">{link.title}</h1>
                                                </div>
                                                <p className="truncate text-xs text-[var(--font-secondary)] ">{link.content}</p>
                                            </div>
                                        </a>
                                    </div>
                                        
                                )
                            }
                        )}
                    </div>
                    )}
                </>
            )}
            <Modal isOpen={isChangeTagModalOpen} setIsOpen={setIsChangeTagModalOpen} title="Change Tag">
                {/* tagsの選択肢を表示 */}
                <div className="flex flex-wrap gap-2">
                    {tags && tags.map((tag:any) => {
                        return(
                        tag.id === selectedTag ?(
                            <button key={tag.id} disabled  className="bg-[var(--bg-primary)] text-xs px-3 py-1 border-2 border-[var(--bg-secondary)] rounded-full text-[var(--font-secondary)]">{tag.name}</button>
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