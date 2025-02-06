import { useState, useCallback, useEffect, useRef } from "react";

export default function useScreenDrag<T extends HTMLElement>() {
  // handle node (ref) init
  const [node, setNode] = useState<T | null>(null);
  const screenRef = useRef<T>(null);
  const screen = useCallback((refNode: T | null) => {
    if (refNode) {
      setNode(refNode);
      screenRef.current = refNode;
    }
  }, []);

  // indicates wheather the screen is currently dragged by the user
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // defines the drag distance since the drag started
  const [dragDistance, setDragDistance] = useState<number>(0);

  // handle mouse event listeners
  useEffect(() => {
    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        setDragDistance((d) => d + event.movementY);
      }
    };

    if (node) {
      node.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
      node.addEventListener('mousemove', handleMouseMove);
      return () => {
        node.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        node.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [isDragging, node]);

  // handle touch event listeners
  const [prevTouchPos, setlPrevTouchPos] = useState(0);
  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      setlPrevTouchPos(event.touches[0].clientY);
      setIsDragging(true);
    };
    const handleTouchEnd = () => setIsDragging(false);
    const handleTouchMove = (event: TouchEvent) => {
      const newTouchPos = event.changedTouches[0].clientY;
      if (isDragging) {
        setDragDistance((d) => d + newTouchPos - prevTouchPos);
      }
      setlPrevTouchPos(newTouchPos);
    };

    if (node) {
      node.addEventListener('touchstart', handleTouchStart);
      node.addEventListener('touchend', handleTouchEnd);
      node.addEventListener('touchmove', handleTouchMove);
      return () => {
        node.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchend', handleTouchEnd);
        node.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, [isDragging, node, prevTouchPos]);

  // set screen height
  const [screenHeight, setScreenHeight] = useState(0);
  const getScreenHeight = useCallback(() => {
    if (node) {
      setScreenHeight(node.getBoundingClientRect().height);
    }
  }, [node]);

  useEffect(() => {
    getScreenHeight();

    const handleResize = () => getScreenHeight();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getScreenHeight, node]);

  // defines how hard it is to drag to the next video
  const dragResistance = screenHeight / 8;

  // current scroll position
  const [scrollPos, setScrollPos] = useState(0);

  // set currently active slide
  const [activeView, setActiveView] = useState(1);

  // check if scrollPos is within range
  const scrollPosCheck = (num: number) => {
    if (node) {
      if (num <= 0) {
        setActiveView(0);
        return 0;
      } else if (num >= node.scrollHeight - screenHeight) {
        setActiveView(
          Math.round((node.scrollHeight - screenHeight) / screenHeight)
        );
        return node.scrollHeight - screenHeight;
      } else {
        setActiveView(Math.round(num / screenHeight));
        return num;
      }
    }
    return scrollPos;
  };

  // resets the drag distance when `isDragging` returns to false
  useEffect(() => {
    if (!isDragging) {
      if (-dragDistance > dragResistance) {
        setScrollPos((scrollPos) => scrollPosCheck(scrollPos + screenHeight));
      } else if (dragDistance > dragResistance) {
        setScrollPos((scrollPos) => scrollPosCheck(scrollPos - screenHeight));
      }
      setDragDistance(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  // sets the screen scrollPosition in relation to the drag distance
  useEffect(() => {
    if (node) {
      if (isDragging) {
        node.scrollTo({ top: scrollPos - dragDistance });
      } else {
        node.scrollTo({ top: scrollPos, behavior: 'smooth' });
      }
    }
  }, [dragDistance, isDragging, node, scrollPos]);

  return [screenRef, screen, activeView] as const;
}