"use client";

import { signOut } from "next-auth/react"
import { IoSettingsOutline, IoClose } from "react-icons/io5";
import { FiCommand } from "react-icons/fi";
import { useEffect, useState } from "react";

import Image from "next/image";

import img from "@/public/piece.png";

import Modal from "./modal";

export default function Settings({name}:{name: String}) {

    const commands = [
        {
            key:"V",
            name:"Add Link"
        }, 
        {
            key:"F",
            name:"Search Link"
        },
    ]
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHowToUseOpen, setIsHowToUseOpen] = useState(false);


    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const modal = document.querySelector('.modal'); // モーダルのクラス名を指定
            if (modal && !modal.contains(event.target as Node)) {
                // クリックされた場所がモーダルの外側であれば、モーダルを閉じる
                setIsModalOpen(false);
            }
        };

        if (isModalOpen) {
            // モーダルが開いている場合にクリックイベントを追加
            document.addEventListener('mousedown', handleOutsideClick);
        }

        // コンポーネントがアンマウントされるときにイベントリスナーを削除
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isModalOpen]);

    return (
        <>
            <div className="fixed z-50 top-5 right-5">
                {isModalOpen ? (
                    <div className="modal rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
                        {/* commands */}
                        <div className="p-3">
                            <p className="text-xs mb-2 text-[var(--font-secondary)]">Commands</p>
                            <div className="flex flex-col gap-2">
                            {commands.map((command)=>{
                                return (
                                    <div key={command.key} className="flex flex-row gap-2 items-center">
                                        <div className="flex flex-row items-center gap-1 border border-[var(--border)] bg-[var(--bg-primary)] px-2 py-1 rounded-md">
                                            <FiCommand className="text-sm cursor-pointer" />
                                            <p className="text-xs">{command.key}</p>
                                        </div>
                                        <span className="text-xs">{command.name}</span>
                                    </div>
                                );
                            })}
                            </div>
                        </div>
                        {/* how to use */}
                        <div className="border-t border-[var(--border)] p-3">
                            <p className="text-xs mb-2 text-[var(--font-secondary)]">How to use</p>
                            <button onClick={()=>{setIsHowToUseOpen(!isHowToUseOpen), setIsModalOpen(!isModalOpen)}} className="btn-secondary text-xs w-full">Open Details</button>
                        </div>
                        {/* account */}
                        <div className="border-t border-[var(--border)] p-3 flex flex-col">
                            <p className="text-xs mb-1 text-[var(--font-secondary)]">Account</p>
                            <div className="text-xs flex flex-col items-start gap-3">
                                {name}
                                <button className="btn-secondary w-full" onClick={() => signOut()}>
                                    Sign out
                                </button>
                            </div>
                        </div>
                        <button onClick={()=>setIsModalOpen(false)} className="border-t border-[var(--border)]  flex flex-row p-3 py-2 w-full flex flex-row gap-1 items-center">
                            <IoClose className="text-md text-[var(--font-secondary)] cursor-pointer" />
                            <span className="text-xs text-[var(--font-secondary)]">Close</span>
                        </button>
                    </div>
                ):(
                    <div>
                        <button className="group p-2 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)]" onClick={()=>setIsModalOpen(true)}>
                            <IoSettingsOutline className="group-hover:rotate-45 transform-all duration-200 text-xl text-[var(--font-secondary)] cursor-pointer" />
                        </button>
                    </div>
                )}
            </div>
            <Modal isOpen={isHowToUseOpen} setIsOpen={setIsHowToUseOpen} title="How to Use">
                <div className="flex flex-row items-end">
                    <div className="flex flex-col gap-2 text-sm ">
                        <p className="px-2 py-1 border border-[var(--border)] rounded-lg text-xs w-fit">In your favorite pages</p>
                        <p>Copy the Link what you want to save.</p>
                        <p className="mt-3 px-2 py-1 border border-[var(--border)] rounded-lg text-xs w-fit">In 📚Shelf.</p>
                        <div className="flex items-center">
                            <FiCommand/>
                            <p>V to save the Link.</p>
                        </div>
                        <div className="flex items-center">
                            <FiCommand/>
                            <p>F to search the Link.</p>
                        </div>
                        <p className="mt-5">🤟 Enjoy !</p>
                    </div>
                    <div className="flex flex-row justify-between items-end w-3/5">
                        <Image src={img}  alt="desk" />
                    </div>
                </div>
            </Modal>
        </>
    );
}