"use client";

import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { useEffect } from "react";

import bgNoise from "@/public/noise.jpg";

export default function Modal({isOpen, setIsOpen, title, children}:{isOpen: Boolean, setIsOpen: Function, title:String, children:JSX.Element[]}) {
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const modal = document.querySelector('.modal'); // モーダルのクラス名を指定
            if (modal && !modal.contains(event.target as Node)) {
                // クリックされた場所がモーダルの外側であれば、モーダルを閉じる
                setIsOpen(false);
            }
        };

        if (isOpen) {
            // モーダルが開いている場合にクリックイベントを追加
            document.addEventListener('mousedown', handleOutsideClick);
        }

        // コンポーネントがアンマウントされるときにイベントリスナーを削除
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen, setIsOpen]);

    return (
        <>
        {isOpen && (
        <div className="fixed top-1/2 -translate-y-1/2 w-full h-full px-3 backdrop-blur-[2px]">
            <div className="modal fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-3 overflow-hidden">
                <div className="rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)]">
                    <div className="p-5">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-row justify-between items-center">
                                <h1 className="text-[var(--font-secondary)]">{title}</h1>
                                <button>
                                    <IoClose onClick={()=>setIsOpen(!isOpen)} className="text-lg text-[var(--font-secondary)] cursor-pointer" />
                                </button>
                            </div>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>  
        )}
        </>
    );
}