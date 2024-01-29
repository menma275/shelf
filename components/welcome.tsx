import {signIn} from "next-auth/react"

import Image from "next/image";
import img from "@/public/reader.png";

export default function Welcome() {
    return (
        <div className="h-[100dvh] flex flex-col gap-5 justify-center py-16">
            <div className="flex h-full sm:h-fit flex-col sm:flex-row justify-between">
                <div className="flex flex-col justify-start gap-5">
                    <h1 className="font-serif text-3xl">📚Shelf</h1>
                    <p className="text-md">Place to save your favorite links.</p>
                </div>
                <div className="flex items-center justify-center">
                    <Image className="w-64 object-contain" src={img}  alt="desk" />
                </div>
            </div>
            <button className="btn-primary w-full sm:w-fit" onClick={() => signIn()}>Sign in with Google</button>
        </div>
    );
}