import { useState, useEffect, useRef, useCallback } from "react";
import "./index.scss";

const RaijinsScrollbar = ({ children }) => {
  const contentRef = useRef(null);
  const scrollTrackRef = useRef(null);
  const scrollThumbRef = useRef(null);
  const observer = useRef(null);
  const [thumbHeight, setThumbHeight] = useState(20);
  const [scrollStartPosition, setScrollStartPosition] = useState(null);
  const [initialScrollTop, setInitialScrollTop] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleResize = (ref, trackSize) => {
    const { clientHeight, scrollHeight } = ref;
    setThumbHeight(Math.max((clientHeight / scrollHeight) * trackSize, 20));
  };

  useEffect(() => {
    if (contentRef.current && scrollTrackRef.current) {
      const ref = contentRef.current;
      const { clientHeight: trackSize } = scrollTrackRef.current;
      observer.current = new ResizeObserver(() => {
        handleResize(ref, trackSize);
      });
      observer.current.observe(ref);
      ref.addEventListener("scroll", handleThumbPosition);
      return () => {
        observer.current?.unobserve(ref);
        ref.removeEventListener("scroll", handleThumbPosition);
      };
    }
  }, []);

  const handleThumbPosition = useCallback(() => {
    if (
      !contentRef.current ||
      !scrollTrackRef.current ||
      !scrollThumbRef.current
    ) {
      return;
    }

    const { scrollTop: contentTop, scrollHeight: contentHeight } =
      contentRef.current;
    const { clientHeight: trackHeight } = scrollTrackRef.current;
    let newTop = (+contentTop / +contentHeight) * trackHeight;
    newTop = Math.min(newTop, trackHeight - thumbHeight);
    const thumb = scrollThumbRef.current;
    thumb.style.top = `${newTop}px`;
  }, []);

  const handleScrollButton = (direction) => {
    const { current } = contentRef;
    if (current) {
      const scrollAmount = direction === "down" ? 200 : -200;
      current.scrollBy({ top: scrollAmount, behavior: "smooth" });
    }
  };

  const handleTrackClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      const { current: trackCurrent } = scrollTrackRef;
      const { current: contentCurrent } = contentRef;
      if (trackCurrent && contentCurrent) {
        const { clientY } = e;
        const target = e.target;
        const rect = target.getBoundingClientRect();
        const trackTop = rect.top;
        const thumbOffset = -(thumbHeight / 2);
        const clickRatio =
          (clientY - trackTop + thumbOffset) / trackCurrent.clientHeight;
        const scrollAmount = Math.floor(
          clickRatio * contentCurrent.scrollHeight
        );

        contentCurrent.scrollTo({
          top: scrollAmount,
          behavior: "smooth",
        });
      }
    },
    [thumbHeight]
  );

  const handleThumbMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setScrollStartPosition(e.clientY);
    if (contentRef.current) setInitialScrollTop(contentRef.current.scrollTop);
    setIsDragging(true);
  }, []);

  const handleThumbMouseUp = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isDragging) {
        setIsDragging(false);
      }
    },
    [isDragging]
  );

  const handleThumbMouseMove = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDragging) {
      const {
        scrollHeight: contentScrollHeight,
        offsetHeight: contentOffsetHeight,
      } = contentRef.current;

      const deltaY =
        (e.clientY - scrollStartPosition) * (contentOffsetHeight / thumbHeight);
      const newScrollTop = Math.min();
    }
  });

  return (
    <div className="Raijins-scrollbars">
      <div className="content" ref={contentRef} {...props}>
        {children}
      </div>
      <div className="scrollbar">
        <button className="button" onClick={() => handleScrollButton("up")}>
          ⇑
        </button>
        <div className="track-and-thumb">
          <div
            className="track"
            ref={scrollTrackRef}
            onClick={handleTrackClick}
          ></div>
          <div
            className="thumb"
            ref={scrollThumbRef}
            style={{ height: `${thumbHeight}px` }}
          ></div>
        </div>
        <button className="button" onClick={() => handleScrollButton("down")}>
          ⇓
        </button>
      </div>
    </div>
  );
};

export default RaijinsScrollbar;
