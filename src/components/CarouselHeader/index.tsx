"use client"

import LogoSVG from "@public/logo.svg";
import MenuDotsSVG from "@public/dots.svg";
import EpisodesListSVG from "@public/episodes-list.svg";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Novel } from "@/app/shorts/[slug]/page";

interface HeaderProps {
  novel: Novel;
}

export default function Header({ novel }: Readonly<HeaderProps>) {
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  function handleOpenMenu(): void {
    if (openMenu === true) {
      return setOpenMenu(false);
    }

    setOpenMenu(true);
  }

  return (
    <header className={`fixed w-full md:w-mobile-screen-w md:left-1/2 md:-translate-x-1/2 md:top-[3.8rem] h-14 z-10 flex items-center justify-between py-3 px-4 ${ openMenu ? "bg-gray-800 bg-opacity-40 border-b border-gray-600 border-opacity-40" : ""}`}>
      <Link href={"/"}>
        <Image className="" src={LogoSVG} alt="logo icon" width={128} height={20} priority={true} quality={100}/>
      </Link>

      <div className="px-3 cursor-pointer" onClick={handleOpenMenu}>
        <Image src={MenuDotsSVG} alt="menu dots icon" width={32} height={32}/>
      </div>
      { openMenu && (
      <div className="absolute right-4 top-16 min-w-40 bg-gray-800 bg-opacity-40 border border-gray-600 border-opacity-40 rounded">
        <ul>
          <Link href={`/novel/${novel.slug}`}>
            <li className="p-4 text-nowrap">
              <Image className="inline mr-2" src={EpisodesListSVG} alt="window icon" width={24} height={24}/>
              <p className="inline font-semibold">Lista de Episódios</p>
            </li>
          </Link>
        </ul>
      </div>)}
    </header>
  );
}