"use client"

/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect, Dispatch, SetStateAction } from "react";
import useWindowSize, { WindowSize } from "./useWindowSize";

const DRAG_RESISTANCE: number = 6;

export default function useCarousel<T extends HTMLElement>(): [(refNode: T) => void, screen: T | null, cardIndex: number, () => void, () => void, Dispatch<SetStateAction<boolean>>] {
  const [screen, setScreen] = useState<T | null>(null);

  const screenRef = useCallback((refNode: T) => {
    if (refNode) {
      setScreen(refNode);
    }
  }, []);

  const windowSize: WindowSize = useWindowSize();
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [enableDrag, setEnableDrag] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragDistance, setDragDistance] = useState<number>(0);
  const [touchDistance, setTouchDistance] = useState<number>(0);

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
    setVisibleSlide(currentSlideIndex + 1);
  }

  function prevSlide(): void {
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
    if (screen) {
      screen.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleMouseUp);
      screen.addEventListener("mousemove", handleMouseMove);
    }

    return function () {
      if (screen) {
        screen.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mouseup", handleMouseUp);
        screen.removeEventListener("mousemove", handleMouseMove);
      }
    }
  }, [isDragging, screen]);

  function handleTouchStart(event: TouchEvent): void {
    setTouchDistance(event.touches[0].clientY);
    setIsDragging(true);
  }

  function handleTouchEnd(): void {
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
    if (screen) {
      screen.addEventListener('touchstart', handleTouchStart);
      screen.addEventListener('touchend', handleTouchEnd);
      screen.addEventListener('touchmove', handleTouchMove);
    }

    return function () {
      if (screen) {
        screen.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchend', handleTouchEnd);
        screen.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [isDragging, screen, touchDistance]);

  useEffect(() => {
    if (!screen || !enableDrag) { return; }

    if (!isDragging) {
      setVisibleSlide(currentSlideIndex);
      return;
    }

    translateSlide(currentSlideIndex * windowSize.height - dragDistance);
  }, [dragDistance, isDragging, screen]);

  useEffect(() => {
    if (isDragging || !enableDrag) { return; }

    const dragResistance: number = windowSize.height / DRAG_RESISTANCE;

    if (-dragDistance > dragResistance) {
      nextSlide()
    } else if (dragDistance > dragResistance) {
      prevSlide();
    }

    setDragDistance(0);
  }, [isDragging, currentSlideIndex]);

  return [screenRef, screen, currentSlideIndex, nextSlide, prevSlide, setEnableDrag]
}