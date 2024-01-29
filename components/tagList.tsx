import { IoAddCircleOutline } from "react-icons/io5";
import { HiOutlineAdjustments } from "react-icons/hi";

export default function TagList({tags, selectedTag, setSelectedTag, setIsAddTagModalOpen}:{tags:any, selectedTag:number, setSelectedTag:Function, setIsAddTagModalOpen:Function}) {
    return (
      <>
        <div className="fixed left-1/2 bottom-20 sm:top-16 -translate-x-1/2 w-fit h-fit max-w-full px-3">
            <div className="flex flex-row justify-start px-5 py-2 gap-2 overflow-x-auto bg-[var(--bg-primary)] border border-[var(--border)] rounded-full">
              {/* 全てを表示 */}
              {selectedTag === 0 ? (
              <button onClick={()=>setSelectedTag(null)} className="whitespace-nowrap text-xs text-[var(--bg-primary)] bg-[var(--font-primary)] border border-[var(--border)] px-2 py-1 rounded-lg">All</button>
              ):(
              <button onClick={()=>setSelectedTag(null)} className="whitespace-nowrap text-xs text-[var(--font-secondary)] border border-[var(--bg-primary)] px-2 py-1 rounded-lg hover:bg-[var(--bg-secondary)] duration-100">All</button>
              )}
              {/* 制作済みのタグ */}
              {tags && tags.map((tag:any) => (
                tag.id === selectedTag ?(
                <button onClick={()=>setSelectedTag(tag.id)} key={tag.id} className=" whitespace-nowrap text-xs text-[var(--bg-primary)] bg-[var(--font-primary)] px-2 py-1 rounded-lg">{tag.name}</button>
                ):(
                <button onClick={()=>setSelectedTag(tag.id)} key={tag.id} className=" whitespace-nowrap text-xs text-[var(--font-secondary)] px-2 py-1 rounded-lg hover:bg-[var(--bg-secondary)] duration-100">{tag.name}</button>
                )
              ))}
              <button onClick={()=>setIsAddTagModalOpen(true)} className="text-[var(--font-secondary)] text-lg rounded-full hover:text-[var(--font-primary)] duration-300 transition-all"><IoAddCircleOutline/></button>
          </div>
        </div>
      </>
    )
}