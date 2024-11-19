import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import Button from "./../../common/components/Button";
import CloudinaryUploadWidget from "../../utils/CloudinaryUploadWidget";
import { useDispatch, useSelector } from "react-redux";
import {
  createDiary,
  getDiaryDetail,
  updateDiary,
} from "../../features/diary/diarySlice";
import { fetchAllMoods } from "../../features/mood/moodSlice";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const DiaryFormPage = () => {
  const { diaryId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedDate, setSelectedDate] = useState("");
  const [mood, setMood] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");

  const { moodList = [], loading: moodLoading } = useSelector(
    (state) => state.mood || {}
  );
  const { selectedDiary, loading: diaryLoading } = useSelector(
    (state) => state.diary || {}
  );

  useEffect(() => {
    if (diaryId) {
      dispatch(getDiaryDetail(diaryId));
    }
  }, [diaryId, dispatch]);

  useEffect(() => {
    if (diaryId && selectedDiary) {
      setSelectedDate(selectedDiary.selectedDate || "");
      setMood(selectedDiary.mood || "");
      setTitle(selectedDiary.title || "");
      setImage(selectedDiary.image || "");
      setContent(selectedDiary.content || "");
    }
  }, [diaryId, selectedDiary]);

  useEffect(() => {
    dispatch(fetchAllMoods());
  }, [dispatch]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      selectedDate,
      mood,
      title,
      image,
      content,
    };

    if (diaryId) {
      dispatch(updateDiary({ diaryId, payload }))
        .unwrap()
        .then(() => {
          alert("Diary updated successfully!");
          navigate(`/diaries/${diaryId}/edit`);
        })
        .catch((error) => {
          alert(`Failed to update diary: ${error}`);
        });
    } else {
      dispatch(createDiary(payload))
        .unwrap()
        .then(() => {
          alert("Diary created successfully!");
          navigate("/diaries");
        })
        .catch((error) => {
          alert(`Failed to create diary: ${error}`);
        });
    }
  };

  const handleImageUpload = (url) => {
    setImage(url);
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">{diaryId ? "Edit Diary" : "Write a Diary"}</h1>
      {diaryLoading ? (
        <p>Loading...</p>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="selectedDate">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="mood">
                <Form.Label>Today's Mood</Form.Label>
                <Form.Select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  required
                >
                  <option value="">Select a mood</option>
                  {moodLoading ? (
                    <option disabled>Loading...</option>
                  ) : moodList.length > 0 ? (
                    moodList.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No moods available</option>
                  )}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="title" className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter diary title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="image" className="mb-3">
            <Form.Label>Attach an Image</Form.Label>
            <CloudinaryUploadWidget uploadImage={handleImageUpload} />
            {image && (
              <img
                src={image}
                alt="Uploaded preview"
                className="mt-3"
                style={{
                  width: "100%",
                  maxHeight: "200px",
                  objectFit: "contain",
                }}
              />
            )}
          </Form.Group>

          <Form.Group controlId="content" className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              placeholder="Write your diary entry here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit">{diaryId ? "Update" : "Submit"}</Button>
        </Form>
      )}
    </div>
  );
};

export default DiaryFormPage;
