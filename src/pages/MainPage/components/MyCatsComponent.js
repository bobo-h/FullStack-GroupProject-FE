import React, { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import testCatImage1 from "../../../assets/test_cats/cat_1.png";
import testCatImage2 from "../../../assets/test_cats/cat_2.png";
import testCatImage3 from "../../../assets/test_cats/cat_3.png";
import testCatImage4 from "../../../assets/test_cats/cat_4.png";
import testCatImage5 from "../../../assets/test_cats/cat_5.png";
import testCatImage6 from "../../../assets/test_cats/cat_6.png";
import testCatImage7 from "../../../assets/test_cats/cat_7.png";

function MyCatsComponent() {
  const [cats, setCats] = useState([
    {
      id: "cat1",
      image: testCatImage1,
      defaultPosition: { x: 0, y: 0 },
      zIndex: 2,
      showInput: false,
      positionPercentage: { x: 20, y: 0 },
      flipped: false, // 좌우반전
    },
    {
      id: "cat2",
      image: testCatImage2,
      defaultPosition: { x: 0, y: 0 },
      zIndex: 2,
      showInput: false,
      positionPercentage: { x: 20, y: 0 },
      flipped: false, // 좌우반전
    },
    {
      id: "cat3",
      image: testCatImage3,
      defaultPosition: { x: 0, y: 0 },
      zIndex: 2,
      showInput: false,
      positionPercentage: { x: 20, y: 0 },
      flipped: false, // 좌우반전
    },
    {
      id: "cat4",
      image: testCatImage4,
      defaultPosition: { x: 0, y: 0 },
      zIndex: 2,
      showInput: false,
      positionPercentage: { x: 20, y: 0 },
      flipped: false, // 좌우반전
    },
    {
      id: "cat5",
      image: testCatImage5,
      defaultPosition: { x: 0, y: 0 },
      zIndex: 2,
      showInput: false,
      positionPercentage: { x: 20, y: 0 },
      flipped: false, // 좌우반전
    },
    {
      id: "cat6",
      image: testCatImage6,
      defaultPosition: { x: 0, y: 0 },
      zIndex: 2,
      showInput: false,
      positionPercentage: { x: 20, y: 0 },
      flipped: false, // 좌우반전
    },
    {
      id: "cat7",
      image: testCatImage7,
      defaultPosition: { x: 0, y: 0 },
      zIndex: 2,
      showInput: false,
      positionPercentage: { x: 20, y: 0 },
      flipped: false, // 좌우반전
    },
  ]);

  // 창 크기 변경 시 위치 업데이트
  useEffect(() => {
    const updatePositions = () => {
      setCats((prevCats) =>
        prevCats.map((cat) => ({
          ...cat,
          defaultPosition: {
            x: (window.innerWidth * cat.positionPercentage.x) / 100,
            y: (window.innerHeight * cat.positionPercentage.y) / 100,
          },
        }))
      );
    };

    // 초기 위치 설정
    updatePositions();

    // 리사이즈 이벤트 리스너 추가
    window.addEventListener("resize", updatePositions);

    // 클린업 함수로 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", updatePositions);
    };
  }, []);

  // 드래그 완료 시 위치 저장 (픽셀 값을 %로 변환하여 저장)
  const handleDragStop = (id, data) => {
    setCats((prevCats) =>
      prevCats.map((cat) =>
        cat.id === id
          ? {
              ...cat,
              defaultPosition: { x: data.x, y: data.y },
              positionPercentage: {
                x: (data.x / window.innerWidth) * 100,
                y: (data.y / window.innerHeight) * 100,
              },
            }
          : cat
      )
    );
  };

  // 우클릭 시 입력 필드 표시 토글
  const handleToggleInput = (id) => {
    setCats((prevCats) =>
      prevCats.map((cat) =>
        cat.id === id ? { ...cat, showInput: !cat.showInput } : cat
      )
    );
  };

  // zIndex 변경 (-1 또는 +1) 2~20사이로만 변경가능
  const handleZIndexChange = (id, newZIndex) => {
    const clampedZIndex = Math.max(2, Math.min(newZIndex, 20));
    setCats((prevCats) =>
      prevCats.map((cat) =>
        cat.id === id ? { ...cat, zIndex: clampedZIndex } : cat
      )
    );
  };

  // 좌우 반전 토글
  const handleFlip = (id) => {
    setCats((prevCats) =>
      prevCats.map((cat) =>
        cat.id === id ? { ...cat, flipped: !cat.flipped } : cat
      )
    );
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {cats.map((cat) => (
        <DraggableCat
          key={cat.id}
          id={cat.id}
          image={cat.image}
          defaultPosition={cat.defaultPosition}
          zIndex={cat.zIndex}
          showInput={cat.showInput}
          flipped={cat.flipped}
          onToggleInput={handleToggleInput}
          onZIndexChange={handleZIndexChange}
          onFlip={handleFlip}
          onDragStop={handleDragStop}
        />
      ))}
    </div>
  );
}

function DraggableCat({
  id,
  image,
  defaultPosition,
  zIndex,
  showInput,
  flipped,
  onToggleInput,
  onZIndexChange,
  onFlip,
  onDragStop,
}) {
  // 말풍선 표시 상태와 타이머 참조 추가
  const [isSpeechBubbleVisible, setIsSpeechBubbleVisible] = useState(false);
  const timerRef = useRef(null);

  // 이미지 클릭 시 말풍선 표시 및 타이머 설정
  const handleImageClick = () => {
    setIsSpeechBubbleVisible(true);

    // 기존 타이머가 있으면 초기화
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // 3초 후에 말풍선 숨기기
    timerRef.current = setTimeout(() => {
      setIsSpeechBubbleVisible(false);
      timerRef.current = null; // 타이머 참조 초기화
    }, 3000);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    onToggleInput(id);
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
      position={defaultPosition}
      onStop={(e, data) => onDragStop(id, data)}
      bounds="parent"
    >
      <div
        style={{
          position: "absolute",
          zIndex: zIndex,
          cursor: "grab",
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
              marginBottom: 10,
              background: "#fff",
              padding: "5px 10px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            야옹!
          </div>
        )}
        <img
          src={image}
          alt="Draggable Cat"
          draggable="false"
          onClick={handleImageClick} // 클릭 핸들러 추가
          style={{
            width: 100,
            transform: flipped ? "scaleX(-1)" : "none",
          }}
        />
        {showInput && (
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
              onClick={() => onZIndexChange(id, zIndex - 1)}
              disabled={zIndex <= 2}
            >
              아래로
            </button>
            <button
              onClick={() => onZIndexChange(id, zIndex + 1)}
              disabled={zIndex >= 20}
            >
              위로
            </button>
            <button onClick={() => onFlip(id)}>좌우 반전</button>
          </div>
        )}
      </div>
    </Draggable>
  );
}

export default MyCatsComponent;
