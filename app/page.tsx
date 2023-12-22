"use client"

import Image from "next/image";

import img from "@/public/book.png";

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react";

import { IoGridOutline, IoMenu } from "react-icons/io5";

import getUser from "@/lib/getUser"
import createUser from "@/lib/createUser";
import getLinks from "@/lib/getLinks";
import addLinks from "@/lib/addLinks";
import getTags from "@/lib/getTags";
import addTag from "@/lib/addTag";
import changeTag from "@/lib/changeTag";

import Welcome from "@/components/welcome";
import Settings from "@/components/settings";
import Modal from "@/components/modal";
import TagList from "@/components/tagList";
import LinkList from "@/components/linkList";
import LinkCard from "@/components/linkCard";

export default function Home() {
  const {data:session} = useSession()
  const [userId, setUserId] = useState<number | null>(null);
  const [isNewUser, setIsNewUser] = useState(false)

  const [inputURL, setInputURL] = useState("")
  const [chooseTag, setChooseTag] = useState("")
  const [inputTag, setInputTag] = useState("")

  const onInputURLChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setInputURL(e.target.value)
  }

  const onChooseTagChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
    setChooseTag(e.target.value)
  }

  const onInputTagChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setInputTag(e.target.value)
  }


  type Link = {
    id: number;
    url: string;
    title: string;
    content: string | null;
    favicon: string | null;
    img: string | null;
    createdAt: Date;
    updatedAt: Date;
    authorId: number | null;
  };
  const [links, setLinks] = useState<Link[]>([]);
  type Tag = {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: number | null;
  };

  const [tags, setTags] = useState<Tag[]>([]);

  const [isAddTagModalOpen, setIsAddTagModalOpen] = useState(false)
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false)

  const [selectedTag, setSelectedTag] = useState(null)

  const [isList, setIsList] = useState(true)

  // command + vを押した時にuseeffect
  useEffect(() => {
    const pasteListener = (e:ClipboardEvent) => {
      setIsAddLinkModalOpen(true)
    }
    document.addEventListener("paste", pasteListener)
    return () => {
      document.removeEventListener("paste", pasteListener)
    }
  }, [])

  // enterキーでaddbuttonを押す
  useEffect(() => {
    const keydownListener = (e:KeyboardEvent) => {
      if(e.key === "Enter"){
        const addButton = document.getElementById("addbutton")
        if(addButton){
          addButton.click()
        }
      }
    }
    document.addEventListener("keydown", keydownListener)
    return () => {
      document.removeEventListener("keydown", keydownListener)
    }
  }, [])

  // ユーザー情報の取得
  const fetchUser = async () => {
  if (session && session.user && session.user.email && session.user.name) {
    // データベースにuserが存在するか確認
    const user = await getUser(session.user.email);
    if (!user) {
      // データベースに存在しない場合、Googleアカウントの情報から新規作成
      const newUser = await createUser(session.user.email, session.user.name);
      setUserId(newUser.id);
      setIsNewUser(true);
    } else {
      setUserId(user.id);
    }
  }
};
  useEffect(() => {
    fetchUser();
  }, [session, fetchUser]);

  // リンク情報の取得
  const fetchLinks = async () => {
    if(userId){
      const links = await getLinks(userId, selectedTag)
      setLinks(links)
    }
  };
  useEffect(() => {
    fetchLinks();
  }, [userId, selectedTag, fetchLinks]);

  // タグ情報の取得
  const fetchTags = async () => {
    if(userId){
      const tags = await getTags(userId)
      setTags(tags)
    }
  };
  useEffect(() => {
    fetchTags();
  }, [userId, session]);

  // タグ情報の更新
  const changeTagFunc = async (id:number, tag:number) => {
    if(userId){
      await changeTag(userId, id, tag)
    }
  }

  // タグの追加
  const addTagFunc = async (name:string) => {
    if(userId){
      await addTag(userId, name)
      await fetchTags()
    }
  }

  const addLink = (url:string, tag:number) => {
    try {
      new URL(url)
      const fetchAddLink = async () => {
        if(userId){
          const link = await addLinks(userId, tag, url)
          setLinks(links => [...links, link])
        }
      }
      fetchAddLink()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main className="text-sm max-w-lg mx-auto px-3 flex flex-col justify-center items-center">
      <>
        {/* ログイン */}
        {session ? (
          <>
            {/* タグリスト */}
            <TagList userId={userId ?? 0} tags={tags} selectedTag={selectedTag ?? 0} setSelectedTag={setSelectedTag} isAddTagModalOpen={isAddTagModalOpen} setIsAddTagModalOpen={setIsAddTagModalOpen}/>
            {isList ? (
              <LinkList links={links} tags={tags} fetchLinks={fetchLinks} changeTagFunc={changeTagFunc} />
            ) : (
              <LinkCard links={links} tags={tags} fetchLinks={fetchLinks} changeTagFunc={changeTagFunc} />
            )}
            {/* インプット */}
            <div className="fixed bottom-5 sm:bottom-16 left-1/2 -translate-x-1/2 w-full max-w-xl px-3">
              <div className="flex flex-row gap-2 items-center">
                <button
                  onClick={() => setIsAddLinkModalOpen(true)}
                  className="btn-secondary py-3 w-full focus:outline-none"
                >
                  Add Link
                </button>
                <button className="btn-secondary aspect-square rounded-full cursor-pointer" onClick={()=>{setIsList(!isList)}}>
                  {isList ? <IoMenu /> :<IoGridOutline />}
                </button>
              </div>
            </div>
            <Settings name={session?.user?.name ?? "guest"} />
            <Modal isOpen={isNewUser} setIsOpen={setIsNewUser} title="Welcome to 📚Shelf">
                <div className="flex flex-row items-center">
                  <div className="flex justify-start">
                    <Image className="w-3/4" src={img}  alt="desk" />
                  </div>
                  <div className="flex flex-col justify-start text-sm gap-2">
                      <p>You are sign in as </p>
                      <p className="whitespace-nowrap font-mono text-xs px-2 py-1 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)] w-fit">{session?.user?.name ?? "guest"}</p>
                  </div>
                </div>
            </Modal>
            {isAddLinkModalOpen && (
              <Modal isOpen={isAddLinkModalOpen} setIsOpen={setIsAddLinkModalOpen} title="Add Link">
                {/* urlとタイトル、説明、タグを追加 */}
                <div className="flex flex-col gap-2">
                  <input onChange={onInputURLChange} type="url" className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--font-secondary)] px-3 py-2 focus:outline-none" autoFocus={true} placeholder="https://example.com" />
                  {/* tagsからタグを選ぶ */}
                  {selectedTag ? (
                    <>
                      <button id="addbutton" className="btn-accent" onClick={()=>{addLink(inputURL, Number(selectedTag)), setIsAddLinkModalOpen(false)}}>Add Link</button>
                    </>
                  ) : (
                    <>
                      <select className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--font-secondary)] px-3 py-2 focus:outline-none" onChange={onChooseTagChange}>
                        {tags && tags.map((tag:any) => (
                          <option key={tag.id} value={tag.id}>{tag.name}</option>
                        ))}
                      </select>
                      <button id="addbutton" className="btn-accent" onClick={()=>{addLink(inputURL, Number(chooseTag)), setIsAddLinkModalOpen(false)}}>Add Link</button>
                    </>
                  )
                  }
                </div>
              </Modal>
            )}
            {isAddTagModalOpen && (
                <Modal isOpen={isAddTagModalOpen} setIsOpen={setIsAddTagModalOpen} title="Add Tag">
                  {/* タグを追加 */}
                  <div className="flex flex-col gap-2">
                    <input type="text" className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--font-secondary)] px-3 py-2 focus:outline-none" autoFocus={true} placeholder="Tag Name" onChange={onInputTagChange} />
                    <button className="btn-accent" onClick={()=>{setIsAddTagModalOpen(false), addTagFunc(inputTag)}}>Add Tag</button>
                  </div>
                </Modal>
            )}
          </>
        ) : (
          <>
            <Welcome /> 
          </>
        )}
      </>
    </main>
  )
}
