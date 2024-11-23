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
  const parentRef = useRef(null); // 부모 요소를 참조
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

      // 상태를 함수형으로 업데이트
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

        // Redux 업데이트
        dispatch(updateChatbotMany({ updates: updatedCats }));

        return updatedCats; // 상태에 반영
      });
    }
  };

  // 디바운싱 적용
  const debouncedUpdate = debounce(updateSize, 300);

  useEffect(() => {
    updateSize(); // 초기 크기 계산 및 상태 업데이트

    // 창 크기 변경 이벤트 등록
    window.addEventListener("resize", debouncedUpdate);

    return () => {
      window.removeEventListener("resize", debouncedUpdate);
      debouncedUpdate.cancel();
    };
  }, [parentRef]); // 의존성 관리

  // 드래그 완료 시 위치 저장 (픽셀 값을 %로 변환하여 저장)
  const handleDragStop = async (id, data) => {
    const catToUpdate = cats.find((cat) => cat._id === id);
    if (!catToUpdate) return;

    console.log("움직이니?", data);
    const newXY = { x: data.x, y: data.y };
    // 현재 위치와 새 위치 비교
    if (
      catToUpdate.defaultPosition &&
      catToUpdate.defaultPosition.x === newXY.x &&
      catToUpdate.defaultPosition.y === newXY.y
    ) {
      console.log("위치가 동일하므로 업데이트하지 않음");
      return;
    }
    // 지금 위치를 백분율 할때 {x: (cat.defaultPosition.x/width)*100, y: (cat.defaultPosition.y/height)*100}
    try {
      // 서버로 업데이트 요청
      console.log("화면 사이즈", size.width);
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
      // 여기서 추가로 상태를 업데이트하거나 다른 동작 수행 가능
    } catch (error) {
      console.error("Failed to update cat in DB:", error);
    }
  };

  // zIndex 변경 (-1 또는 +1) 2~20사이로만 변경가능
  const handleZIndexChange = async (id, newZIndex) => {
    const catToUpdate = cats.find((cat) => cat._id === id);

    if (!catToUpdate) return;
    // 새로운 값 대입
    const clampedZIndex = Math.max(2, Math.min(newZIndex, 20));
    try {
      // 서버로 업데이트 요청
      await dispatch(
        updateChatbotJins({
          id,
          updateData: { zIndex: clampedZIndex },
        })
      );
      console.log("Cat updated successfully in DB");
      // 여기서 추가로 상태를 업데이트하거나 다른 동작 수행 가능
    } catch (error) {
      console.error("Failed to update cat in DB:", error);
    }
  };

  // 좌우 반전 토글
  const handleFlip = async (id) => {
    const catToUpdate = cats.find((cat) => cat._id === id);

    if (!catToUpdate) return;

    try {
      // flipped 상태를 반전한 데이터 생성
      const updatedCat = !catToUpdate.flip;

      // 서버로 업데이트 요청
      await dispatch(
        updateChatbotJins({
          id,
          updateData: { flip: updatedCat },
        })
      );
      console.log("Cat updated successfully in DB");
      // 여기서 추가로 상태를 업데이트하거나 다른 동작 수행 가능
    } catch (error) {
      console.error("Failed to update cat in DB:", error);
    }
  };

  // const renderedCats = !loading ? cats : localCats; // cats만 줘야 로컬 포지션 관리 가능

  return (
    <div
      ref={parentRef}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      {cats
        .filter((cat) => cat.visualization) // visualization이 true인 것만 필터링
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
  // 말풍선 표시 상태와 타이머 참조 추가
  const [isSpeechBubbleVisible, setIsSpeechBubbleVisible] = useState(false);
  const [activeInputId, setActiveInputId] = useState(null); // 현재 입력 필드가 활성화된 고양이 ID
  const [localLoading, setLocalLoading] = useState(false); // 드래그 로딩 객체별 조정
  const timerRef = useRef(null); // 말풍선 요청 대기
  const lastRequestRef = useRef(null); // 드래그 마지막 요청 저장
  const [zIndex, setZIndex] = useState(initialZIndex); // 로컬 zIndex 상태 추가
  const [flip, setFlip] = useState(initialFlip); // 로컬 flip 상태 추가

  const handleStart = () => {
    setLocalLoading(true); // 드래그 시작 시 로딩 상태 활성화
  };

  const handleDragStopLoading = async (data) => {
    const newXY = { x: data.x, y: data.y };

    // 현재 요청의 식별자 생성
    const currentRequest = Symbol("request");
    lastRequestRef.current = currentRequest;

    try {
      // 비동기 작업 완료 대기
      await onDragStop(id, newXY);

      // 현재 요청이 마지막 요청인지 확인
      if (lastRequestRef.current === currentRequest) {
        console.log("이 요청은 마지막 요청입니다.");
      } else {
        console.log("이 요청은 무시됩니다.");
      }
    } catch (error) {
      console.error("onDragStop 에러 발생:", error);
    } finally {
      // 마지막 요청만 로딩 종료
      if (lastRequestRef.current === currentRequest) {
        setLocalLoading(false);
      }
    }
  };

  // 이미지 클릭 시 말풍선 표시 및 타이머 설정
  const handleImageClick = () => {
    setIsSpeechBubbleVisible(true);

    // 기존 타이머가 있으면 초기화
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // 15초 후에 말풍선 숨기기
    timerRef.current = setTimeout(() => {
      setIsSpeechBubbleVisible(false);
      timerRef.current = null; // 타이머 참조 초기화
    }, 15000);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setActiveInputId((prevId) => (prevId === id ? null : id)); // 동일 ID 클릭 시 닫기
  };

  // zIndex 즉각 변경 후 서버 동기화
  const handleZIndexChange = (change) => {
    const newZIndex = zIndex + change;
    if (newZIndex >= 2 && newZIndex <= 20) {
      setZIndex(newZIndex); // 클라이언트에서 즉각 변경
      onZIndexChange(id, newZIndex); // 서버와 동기화
    }
  };

  // flip 즉각 변경 후 서버 동기화
  const handleFlip = () => {
    const newFlip = !flip;
    setFlip(newFlip); // 클라이언트에서 즉각 변경
    onFlip(id, newFlip); // 서버와 동기화
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <Draggable
      position={!localLoading ? defaultPosition : undefined} // defaultPosition 사용 보류
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
        {/* 말풍선 렌더링 */}
        {isSpeechBubbleVisible && (
          <div
            style={{
              position: "absolute",
              bottom: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              // marginBottom: 10,
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
          onClick={handleImageClick} // 클릭 핸들러 추가
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
