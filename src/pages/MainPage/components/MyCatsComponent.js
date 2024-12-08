import React, { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import { debounce } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import ToastChatbotComponent from "./ToastChatbotComponent";
import {
  updateChatbotJins,
  updateChatbotMany,
} from "../../../features/chatbot/chatbotSlice";

function MyCatsComponent() {
  const dispatch = useDispatch();
  const parentRef = useRef(null);
  const [size, setSize] = useState({});
  const { cats, loading } = useSelector((state) => state.chatbot);
  const [localCats, setLocalCats] = useState(cats || []);

  useEffect(() => {
    if (!loading) {
      setLocalCats(cats);
    }
  }, [cats, size]);

  const updateSize = async () => {
    if (parentRef.current) {
      const { width, height } = parentRef.current.getBoundingClientRect();
      setSize({ width, height });

      setLocalCats((prevCats) => {
        const updatedCats = prevCats.map((cat) => {
          const updatedX = (cat.position.x / 100) * width;
          const updatedY = (cat.position.y / 100) * height;

          const percentageX = (updatedX / width) * 100;
          const percentageY = (updatedY / height) * 100;

          return {
            ...cat,
            position: { x: percentageX, y: percentageY },
            defaultPosition: { x: updatedX, y: updatedY },
          };
        });

        dispatch(updateChatbotMany({ updates: updatedCats }));

        return updatedCats;
      });
    }
  };

  const debouncedUpdate = debounce(updateSize, 300);

  useEffect(() => {
    debouncedUpdate();

    window.addEventListener("resize", debouncedUpdate);

    return () => {
      window.removeEventListener("resize", debouncedUpdate);
      debouncedUpdate.cancel();
    };
  }, [parentRef]);

  const handleDragStop = async (id, data) => {
    const catToUpdate = cats.find((cat) => cat._id === id);
    if (!catToUpdate) return;

    const newXY = { x: data.x, y: data.y };

    if (
      catToUpdate.defaultPosition &&
      catToUpdate.defaultPosition.x === newXY.x &&
      catToUpdate.defaultPosition.y === newXY.y
    ) {
      // console.log("위치가 동일하므로 업데이트하지 않음");
      return;
    }

    try {
      // console.log("화면 사이즈", size.width);
      await dispatch(
        updateChatbotJins({
          id,
          updateData: {
            defaultPosition: newXY,
            position: {
              x: (newXY.x / size.width) * 100,
              y: (newXY.y / size.height) * 100,
            },
          },
        })
      );
      console.log("Cat updated successfully in DB");
    } catch (error) {
      console.error("Failed to update cat in DB:", error);
    }
  };

  const handleZIndexChange = async (id, newZIndex) => {
    const catToUpdate = cats.find((cat) => cat._id === id);

    if (!catToUpdate) return;

    const clampedZIndex = Math.max(2, Math.min(newZIndex, 20));
    try {
      await dispatch(
        updateChatbotJins({
          id,
          updateData: { zIndex: clampedZIndex },
        })
      );
      console.log("Cat updated successfully in DB");
    } catch (error) {
      console.error("Failed to update cat in DB:", error);
    }
  };

  const handleFlip = async (id) => {
    const catToUpdate = cats.find((cat) => cat._id === id);

    if (!catToUpdate) return;

    try {
      const updatedCat = !catToUpdate.flip;

      await dispatch(
        updateChatbotJins({
          id,
          updateData: { flip: updatedCat },
        })
      );
      console.log("Cat updated successfully in DB");
    } catch (error) {
      console.error("Failed to update cat in DB:", error);
    }
  };

  return (
    <div
      ref={parentRef}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      {cats
        .filter((cat) => cat.visualization)
        .map((cat) => (
          <DraggableCat
            key={cat._id}
            id={cat._id}
            image={cat.product_id.image}
            defaultPosition={cat.defaultPosition}
            zIndex={cat.zIndex}
            flip={cat.flip}
            onZIndexChange={handleZIndexChange}
            onFlip={handleFlip}
            onDragStop={handleDragStop}
            personality={cat.personality}
          />
        ))}
    </div>
  );
}

function DraggableCat({
  id,
  image,
  defaultPosition,
  zIndex: initialZIndex,
  flip: initialFlip,
  onZIndexChange,
  onFlip,
  onDragStop,
  personality,
}) {
  const [isSpeechBubbleVisible, setIsSpeechBubbleVisible] = useState(false);
  const [activeInputId, setActiveInputId] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  const timerRef = useRef(null);
  const lastRequestRef = useRef(null);
  const [zIndex, setZIndex] = useState(initialZIndex);
  const [flip, setFlip] = useState(initialFlip);

  const handleStart = () => {
    setLocalLoading(true);
    lastRequestRef.current = Symbol("dragging");
  };

  const handleDragStopLoading = async (data) => {
    const newXY = { x: data.x, y: data.y };

    const currentRequest = Symbol("request");
    lastRequestRef.current = currentRequest;

    try {
      await onDragStop(id, newXY);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (lastRequestRef.current === currentRequest) {
        console.log("이 요청은 2초 후에도 마지막 요청입니다.");
      } else {
        console.log("이 요청은 2초 후 무시되었습니다.");
      }
    } catch (error) {
      console.error("onDragStop 에러 발생:", error);
    } finally {
      if (lastRequestRef.current === currentRequest) {
        setLocalLoading(false);
      }
    }
  };

  const handleImageClick = () => {
    setIsSpeechBubbleVisible(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setIsSpeechBubbleVisible(false);
      timerRef.current = null;
    }, 10000);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setActiveInputId((prevId) => (prevId === id ? null : id));
  };

  const handleZIndexChange = (change) => {
    const newZIndex = zIndex + change;
    if (newZIndex >= 2 && newZIndex <= 20) {
      setZIndex(newZIndex);
      onZIndexChange(id, newZIndex);
    }
  };

  const handleFlip = () => {
    const newFlip = !flip;
    setFlip(newFlip);
    onFlip(id, newFlip);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <Draggable
      position={!localLoading ? defaultPosition : undefined}
      onStart={handleStart}
      onStop={(e, data) => handleDragStopLoading(data)}
      bounds="parent"
    >
      <div
        style={{
          position: "absolute",
          zIndex: zIndex,
          cursor: "grab",
          userSelect: "none",
        }}
        onContextMenu={handleContextMenu}
      >
        {isSpeechBubbleVisible && (
          <div
            style={{
              position: "absolute",
              bottom: "100%",
              left: "50%",
              transform: "translateX(-50%)",

              background: "#fff",
              padding: "5px 10px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            <ToastChatbotComponent catPersonality={personality} />
          </div>
        )}
        <img
          src={image}
          alt="Draggable Cat"
          draggable="false"
          onClick={handleImageClick}
          style={{
            width: 100,
            transform: flip ? "scaleX(-1)" : "none",
          }}
        />
        {activeInputId === id && (
          <div
            style={{
              marginTop: 5,
              background: "#fff",
              padding: "5px",
              border: "1px solid #ccc",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <button
              onClick={() => handleZIndexChange(-1)}
              disabled={zIndex <= 2}
            >
              뒤로
            </button>
            <button
              onClick={() => handleZIndexChange(1)}
              disabled={zIndex >= 20}
            >
              앞으로
            </button>
            <button onClick={handleFlip}>좌우 반전</button>
          </div>
        )}
      </div>
    </Draggable>
  );
}

export default MyCatsComponent;
