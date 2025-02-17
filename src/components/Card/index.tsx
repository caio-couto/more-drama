"use client"

import useWindowSize, { WindowSize } from "@/hooks/useWindowSize";

interface CardProps {
  hidden: boolean,
  children: React.ReactNode
} 

export default function Card({ hidden, children }: Readonly<CardProps>) {
  const windowSize: WindowSize = useWindowSize();

  return (
    <div className={`w-full`} style={{ height: windowSize.height }}>
      { !hidden && children}
    </div>  
  );
}