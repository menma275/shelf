import {signIn} from "next-auth/react"

import Image from "next/image";
import img from "@/public/reader.png";

export default function Welcome() {
    return (
        <div className="h-[100dvh] flex items-center">
            <div className="flex flex-col w-full gap-5 p-5">
                <div className="flex flex-col gap-2">
                    <h1 className="text-xl">Welcome to <span className="font-serif text-2xl">📚Shelf</span></h1>
                </div>
                <div className="flex flex-row">
                    <div className="flex flex-col justify-between gap-5">
                        <p className="text-md">Shelf is a place to save and share your favorite links.</p>
                        <button className="btn-accent w-fit" onClick={() => signIn()}>Sign in with Google</button>
                    </div>
                    <div className="flex justify-end">
                        <Image className="w-full" src={img}  alt="desk" />
                    </div>
                </div>
            </div>
        </div>
    );
}