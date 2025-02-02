"use server"

import Link from "next/link";

export default async function NovelEpisodes() {
  return (
    <div className="grid grid-cols-6 gap-y-3 gap-x-1">
      <Link href={"/"} className="w-12 h-12 text-center font-semibold rounded bg-primary py-1 leading-10">1</Link>
      <Link href={"/"} className="w-12 h-12 text-center font-semibold rounded bg-background-secondary py-1 leading-10">2</Link>
      <Link href={"/"} className="w-12 h-12 text-center font-semibold rounded bg-background-secondary py-1 leading-10">3</Link>
      <Link href={"/"} className="w-12 h-12 text-center font-semibold rounded bg-background-secondary py-1 leading-10">4</Link>
      <Link href={"/"} className="w-12 h-12 text-center font-semibold rounded bg-background-secondary py-1 leading-10">5</Link>
      <Link href={"/"} className="w-12 h-12 text-center font-semibold rounded bg-background-secondary py-1 leading-10">6</Link>
      <Link href={"/"} className="w-12 h-12 text-center font-semibold rounded bg-background-secondary py-1 leading-10">7</Link>
      <Link href={"/"} className="w-12 h-12 text-center font-semibold rounded bg-background-secondary py-1 leading-10">8</Link>
      <Link href={"/"} className="w-12 h-12 text-center font-semibold rounded bg-background-secondary py-1 leading-10">9</Link>
      <Link href={"/"} className="w-12 h-12 text-center font-semibold rounded bg-background-secondary py-1 leading-10">10</Link>
      <Link href={"/"} className="w-12 h-12 text-center font-semibold rounded bg-background-secondary py-1 leading-10">11</Link>
      <Link href={"/"} className="w-12 h-12 text-center font-semibold rounded bg-background-secondary py-1 leading-10">12</Link>
      <Link href={"/"} className="w-12 h-12 text-center font-semibold rounded bg-background-secondary py-1 leading-10">13</Link>
      <Link href={"/"} className="w-12 h-12 text-center font-semibold rounded bg-background-secondary py-1 leading-10">14</Link>
      <Link href={"/"} className="w-12 h-12 text-center font-semibold rounded bg-background-secondary py-1 leading-10">15</Link>
      <Link href={"/"} className="w-12 h-12 text-center font-semibold rounded bg-background-secondary py-1 leading-10">16</Link>
    </div>
  );
}