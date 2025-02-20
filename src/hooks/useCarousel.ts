"use client"

/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect, Dispatch, SetStateAction } from "react";
import useWindowSize, { WindowSize } from "./useWindowSize";

const DRAG_RESISTANCE: number = 6;

export default function useCarousel<T extends HTMLElement>(): [(refNode: T) => void, (refNode: T) => void, screen: T | null, cardIndex: number, () => void, () => void, handleEnbleDrag: (value: boolean) => void] {
  const [screen, setScreen] = useState<T | null>(null);
  const [slideScreen, setSlideScreen] = useState<T | null>(null);

  const screenRef = useCallback((refNode: T) => {
    if (refNode) {
      setScreen(refNode);
    }
  }, []);

  const slideScreenRef = useCallback((refNode: T) => {
    if (refNode) {
      setSlideScreen(refNode);
    }
  }, []);

  const windowSize: WindowSize = useWindowSize();
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [enableDrag, setEnableDrag] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragDistance, setDragDistance] = useState<number>(0);
  const [touchDistance, setTouchDistance] = useState<number>(0);

  function handleEnbleDrag(value: boolean): void {
    setEnableDrag(value);
  }

  function translateSlide(position: number): void {
    if (!screen) { return; }

    screen.style.transform = `translate(0px, ${-position}px)`;
  };

  function centerPosition(index: number): number {
    const cardHeight: number = windowSize.height;
    const position: number = index * cardHeight;
    return position;
  }

  function setVisibleSlide(index: number): void {
    if (!screen) { return; }

    if (index === -1 || index >= screen.childElementCount) {
      index = currentSlideIndex;
    }

    const position: number = centerPosition(index);
    screen.style.transitionDuration = "0.3s";
    screen.style.transitionProperty = "transform, top, -webkit-transform";
    screen.style.transitionTimingFunction = "cubic-bezier(.05,0,0,1)"
    setCurrentSlideIndex(index);
    translateSlide(position);
  }

  function nextSlide(): void {
    if (!screen || currentSlideIndex + 1 === screen.childElementCount) { return; }

    setVisibleSlide(currentSlideIndex + 1);
  }

  function prevSlide(): void {
    if (!screen || currentSlideIndex === 0) { return; }

    setVisibleSlide(currentSlideIndex - 1);
  }

  function handleMouseDown(): void {
    setIsDragging(true);
  }

  function handleMouseUp(): void {
    setIsDragging(false);
  }

  function handleMouseMove(event: MouseEvent): void {
    if (!isDragging) { return; }

    setDragDistance((distance) => distance + event.movementY);
  }

  // handle mouse event listeners
  useEffect(() => {
    if (slideScreen) {
      slideScreen.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleMouseUp);
      slideScreen.addEventListener("mousemove", handleMouseMove);
    }

    return function () {
      if (slideScreen) {
        slideScreen.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mouseup", handleMouseUp);
        slideScreen.removeEventListener("mousemove", handleMouseMove);
      }
    }
  }, [isDragging, slideScreen]);

  function handleTouchStart(event: TouchEvent): void {
    setTouchDistance(event.touches[0].clientY);
    setIsDragging(true);
  }

  function handleTouchEnd(): void {
    if (!isDragging) { return; }
    setIsDragging(false);
  }

  function handleTouchMove(event: TouchEvent) {
    const newTouchPosition: number = event.changedTouches[0].clientY;

    if (isDragging) {
      setDragDistance((distance) => distance + newTouchPosition - touchDistance);
    }

    setTouchDistance(newTouchPosition);
  }

  // handle touch event listeners
  useEffect(() => {
    if (slideScreen) {
      slideScreen.addEventListener('touchstart', handleTouchStart);
      slideScreen.addEventListener('touchend', handleTouchEnd);
      slideScreen.addEventListener('touchmove', handleTouchMove);
    }

    return function () {
      if (slideScreen) {
        slideScreen.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchend', handleTouchEnd);
        slideScreen.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [isDragging, slideScreen, touchDistance]);

  useEffect(() => {
    if (!screen) { return; }

    if (!isDragging) {
      setVisibleSlide(currentSlideIndex);
      return;
    }

    if (dragDistance < 0 && !enableDrag) { return; }

    translateSlide(currentSlideIndex * windowSize.height - dragDistance);
  }, [dragDistance, isDragging, screen]);

  useEffect(() => {
    if (isDragging) { return; }

    const dragResistance: number = windowSize.height / DRAG_RESISTANCE;

    if (-dragDistance > dragResistance && enableDrag) {
      nextSlide();
    } else if (dragDistance > dragResistance) {
      prevSlide();
    }

    setDragDistance(0);
  }, [isDragging, currentSlideIndex]);

  return [screenRef, slideScreenRef, screen, currentSlideIndex, nextSlide, prevSlide, handleEnbleDrag] as const
}