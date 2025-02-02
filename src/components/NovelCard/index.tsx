"use server"

import NovelWEBP from "@public/novel.webp";
import Image from "next/image";
import Link from "next/link";

export default async function NovelCard() {
  return (
    <div className="mb-10">
      <div className="max-w-72 mx-auto text-2xl font-semibold text-center mb-4">
        Não desafie a senhora Bilionária
      </div>
      <Link href={"/"}>
        <Image src={NovelWEBP} className="rounded-2xl mx-auto" alt="novel image" width={240} height={340} priority={true} quality={100}/>
      </Link>
    </div>
  );
}