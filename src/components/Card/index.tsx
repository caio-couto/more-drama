"use client"

import useWindowSize, { WindowSize } from "@/hooks/useWindowSize";

interface CardProps {
  hidden: boolean,
  active: boolean,
  children: React.ReactNode
} 

export default function Card({ hidden, active, children }: Readonly<CardProps>) {
  const windowSize: WindowSize = useWindowSize();

  return (
    <div className={`w-full`} style={{ height: windowSize.height }}>
      { !hidden && children}
    </div>  
  );
}