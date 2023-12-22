import { IoAddCircleOutline } from "react-icons/io5";
import Modal from "@/components/modal";

export default function TagList({userId, tags, selectedTag, setSelectedTag, isAddTagModalOpen, setIsAddTagModalOpen}:{userId:number, tags:any, selectedTag:number, setSelectedTag:Function, isAddTagModalOpen:boolean, setIsAddTagModalOpen:Function}) {
    return (
      <>
        <div className="fixed z-10 left-1/2 bottom-20 sm:top-16 -translate-x-1/2 w-fit h-fit max-w-full px-3">
              <div className="flex flex-row justify-start px-5 py-2 gap-2 overflow-x-auto bg-[var(--bg-primary)] border border-[var(--border)] rounded-full"> 
                {selectedTag === null ? (
                  <button onClick={()=>setSelectedTag(null)} className="whitespace-nowrap text-xs text-[var(--font-secondary)] bg-[var(--bg-secondary)] border border-[var(--border)] px-2 py-1 rounded-lg">All</button>
                ):(
                  <button onClick={()=>setSelectedTag(null)} className="whitespace-nowrap text-xs text-[var(--font-secondary)] px-2 py-1 rounded-lg border border-[var(--bg-primary)]">All</button>
                )}
                {tags && tags.map((tag:any) => (
                  tag.id === selectedTag ?(
                  <button onClick={()=>setSelectedTag(tag.id)} key={tag.id} className=" whitespace-nowrap text-xs text-[var(--font-secondary)] bg-[var(--bg-secondary)] border border-[var(--border)] px-2 py-1 rounded-lg">{tag.name}</button>
                  ):(
                  <button onClick={()=>setSelectedTag(tag.id)} key={tag.id} className=" whitespace-nowrap text-xs text-[var(--font-secondary)] px-2 py-1 rounded-lg border border-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] duration-100">{tag.name}</button>
                  )
                ))}
                <button onClick={()=>setIsAddTagModalOpen(true)} className="text-[var(--font-secondary)] text-lg rounded-full hover:text-[var(--font-primary)] duration-300 transition-all"><IoAddCircleOutline/></button>
              </div>
        </div>
      </>
    )
}