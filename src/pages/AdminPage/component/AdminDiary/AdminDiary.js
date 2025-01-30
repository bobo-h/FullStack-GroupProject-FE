import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import MoodTable from "./component/AdminMoodTable";
import Button from "../../../../common/components/Button";
import MoodCard from "./component/AdminMoodCard";
import NewMoodDialog from "./component/NewMoodDialog";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedMood,
  getMoodList,
  clearError,
} from "../../../../features/mood/moodSlice";
import LoadingSpinner from "../../../../common/components/LoadingSpinner";

const AdminDiary = () => {
  const dispatch = useDispatch();
  const [query] = useSearchParams();
  const moodList = useSelector((state) => state.mood.moodList);
  const selectedMood = useSelector((state) => state.mood.selectedMood);
  const success = useSelector((state) => state.mood.success);
  const loading = useSelector((state) => state.mood.loading);
  const [mode, setMode] = useState("new");
  const [showDialog, setShowDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    name: query.get("name") || "",
  });
  const [isMobile, setIsMobile] = useState(false);

  const handleClickNewItem = () => {
    setMode("new");
    dispatch(setSelectedMood(null));
    setShowDialog(true);
  };

  useEffect(() => {
    if (success) {
      setShowDialog(false);
      dispatch(clearError());
    }
  }, [success, dispatch, setShowDialog]);

  useEffect(() => {
    dispatch(getMoodList({ ...searchQuery }));
  }, [query]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 770);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="admin-mood-page">
      <Container>
        <Row>
          <Col md={2}>
            <h2>Mood</h2>
          </Col>
          <Col md={3}>{/* 무드 항목 구분시 여기를 활용 */}</Col>
          <Col md={7} className="text-end">
            <Button onClick={handleClickNewItem}>add Item</Button>
          </Col>
        </Row>
        {loading ? (
          <div className="text-align-center">
            <LoadingSpinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </LoadingSpinner>
          </div>
        ) : (
          <Row className="table-area">
            <MoodTable className="unser-line" />
            {moodList.length > 0 ? (
              moodList.map((mood) => (
                <MoodCard
                  key={mood.id}
                  mood={mood}
                  setMode={setMode}
                  setShowDialog={setShowDialog}
                />
              ))
            ) : (
              <p>No moods available.</p>
            )}
          </Row>
        )}
      </Container>
      <NewMoodDialog
        mode={mode}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        selectedMood={selectedMood}
      />
    </div>
  );
};

export default AdminDiary;
