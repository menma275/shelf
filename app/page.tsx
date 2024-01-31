"use client"

import Image from "next/image";

import img from "@/public/book.png";
import noLinks from "@/public/empty.png";

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react";

import {Oval} from "react-loader-spinner"

import { IoGridOutline, IoMenu } from "react-icons/io5";

import getUser from "@/lib/getUser"
import createUser from "@/lib/createUser";
import getLinks from "@/lib/getLinks";
import addLinks from "@/lib/addLinks";
import getTags from "@/lib/getTags";
import addTag from "@/lib/addTag";
import changeTag from "@/lib/changeTag";
import deleteTag from "@/lib/deleteTag";

import Welcome from "@/components/welcome";
import Settings from "@/components/settings";
import Modal from "@/components/modal";
import TagList from "@/components/tagList";
import LinkList from "@/components/linkList";
import LinkCard from "@/components/linkCard";
import { isPageStatic } from "next/dist/build/utils";

export default function Home() {
  const {data:session} = useSession()
  const [userId, setUserId] = useState<number | null>(null);
  const [isNewUser, setIsNewUser] = useState(false)

  const [inputURL, setInputURL] = useState("")
  const [chooseTag, setChooseTag] = useState(1)
  const [inputTag, setInputTag] = useState("")
  const [erasedTag, setErasedTag] = useState(0)
  const [tags, setTags] = useState<Tag[]>([]);
  const [isAddTagModalOpen, setIsAddTagModalOpen] = useState(false)
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState(0)
  const [selectedTagName, setSelectedTagName] = useState("All" as string | null)
  const [isList, setIsList] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const onInputURLChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setInputURL(e.target.value)
  }

  const onChooseTagChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
    setChooseTag(Number(e.target.value))
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
      setIsLoading(true)
      const links = await getLinks(userId, selectedTag)
      setLinks(links)
      setIsLoading(false)
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [userId, selectedTag]);

  useEffect(() => {
    if(selectedTag){
      const tag = tags.find((tag:any) => tag.id === Number(selectedTag))
      if(tag && tag.name)
        setSelectedTagName(tag.name)
    }else{
      setSelectedTagName("All")
    }
  }
  , [selectedTag, tags])

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
  const changeTagFunc = async (id:number, tag:number, currentTag:number) => {
    if(userId){
      await changeTag(userId, id, tag, currentTag)
    }
  }

  // タグの追加
  const addTagFunc = async (name:string) => {
    if(userId && name!==""){
      await addTag(userId, name)
      await fetchTags()
    }
  }

  const deleteTagFunc = async (tag:number) => {
    if(userId){
      await deleteTag(tag)
      await fetchTags()
      await setSelectedTag(0)
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-screen">
              <Oval color="var(--font-primary)" secondaryColor="var(--font-secondary)" height={50} width={50} />
              <p className="text-[var(--font-secondary)]">Loading...</p>
            </div>
          ):(
            links.length !== 0 ? (
              isList ? (
                <LinkList links={links} selectedTag={selectedTag} tags={tags} fetchLinks={fetchLinks} changeTagFunc={changeTagFunc} />
              ) : (
                <LinkCard links={links} selectedTag={selectedTag} tags={tags} fetchLinks={fetchLinks} changeTagFunc={changeTagFunc} />
              )
            ):(
              <div className="-z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
                <div className="cursor-default h-full flex flex-col items-center justify-center">
                    <p className="font-serif text-lg text-[var(--font-secondary)]">No links yet.</p>
                    <Image className="w-1/2 max-w-[200px]" src={noLinks}  alt="empty" />
                    {(selectedTag !== 0) && (
                      <button
                        onClick={() => deleteTagFunc(selectedTag)}
                        className="text-[var(--font-secondary)] bg-[var(--bg-secondary)] px-3 py-1 rounded-md"
                      >
                        Delete This Tag ?
                      </button>
                    )}
                </div>
              </div>
            )
          )}
            {/* タグリスト */}
            <TagList tags={tags} selectedTag={selectedTag ?? 0} setSelectedTag={setSelectedTag} setIsAddTagModalOpen={setIsAddTagModalOpen} />
            {/* インプット */}
            <div className="fixed bottom-5 sm:bottom-16 left-1/2 -translate-x-1/2 w-full max-w-xl px-3">
              <div className="flex flex-row gap-2 items-center">
                <button
                  onClick={() => setIsAddLinkModalOpen(true)}
                  className="btn-primary py-3 w-full focus:outline-none disabled:bg-[var(--accent-light)]"
                  disabled={tags.length === 0}
                >
                  {tags.length === 0 ? (
                    <>Please Add Tag First.</>
                  ):(
                    <>Add Link</>
                  )
                }
                </button>
                <button className="btn-primary shadow-none aspect-square rounded-full cursor-pointer" onClick={()=>{setIsList(!isList)}}>
                  {isList ? <IoMenu /> :<IoGridOutline />}
                </button>
              </div>
            </div>
            <Settings name={session?.user?.name ?? "guest"} id={userId ?? 0} />
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
            <Modal isOpen={isAddLinkModalOpen} setIsOpen={setIsAddLinkModalOpen} title="Add Link">
              {/* urlとタイトル、説明、タグを追加 */}
              <div className="flex flex-col gap-2">
                <input onChange={onInputURLChange} type="url" className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--font-secondary)] px-3 py-2 focus:outline-none" autoFocus={true} placeholder="https://example.com" />
                {/* tagsからタグを選ぶ */}
                {selectedTag ? (
                  <>
                    {/* 各タグページにいるときはそのタグに追加 */}
                    <button id="addbutton" className="btn-primary py-2 mt-3" onClick={()=>{addLink(inputURL, Number(selectedTag)), setIsAddLinkModalOpen(false)}}>Add Link to {selectedTagName}</button>
                  </>
                ) : (
                  <>
                    {/* ALLタグを選択時はタグを選ぶ */}
                    <select className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--font-secondary)] px-3 py-2 focus:outline-none" onChange={onChooseTagChange}>
                      {tags && tags.map((tag:any) => (
                        <option key={tag.id} value={tag.id}>{tag.name}</option>
                      ))}
                    </select>
                    <button id="addbutton" className="btn-primary py-2 mt-3" onClick={()=>{addLink(inputURL, Number(chooseTag)), setIsAddLinkModalOpen(false)}}>Add Link</button>
                  </>
                )
                }
              </div>
            </Modal>
            <Modal isOpen={isAddTagModalOpen} setIsOpen={setIsAddTagModalOpen} title="Add Tag">
              {/* タグを追加 */}
              <div className="flex flex-col gap-2">
                <input type="text" className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--font-secondary)] px-3 py-2 focus:outline-none" autoFocus={true} placeholder="Tag Name" onChange={onInputTagChange} />
                <button className="btn-primary py-2 mt-3" onClick={()=>{setIsAddTagModalOpen(false), addTagFunc(inputTag)}}>Add Tag</button>
              </div>
            </Modal>
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
