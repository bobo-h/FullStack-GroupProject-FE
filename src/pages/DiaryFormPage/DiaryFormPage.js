import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import CloudinaryUploadWidget from "../../utils/CloudinaryUploadWidget";
import { useDispatch, useSelector } from "react-redux";
import {
  createDiary,
  getDiaryDetail,
  updateDiary,
} from "../../features/diary/diarySlice";
import { fetchAllMoods } from "../../features/mood/moodSlice";
import { useParams } from "react-router-dom";
import Button from "./../../common/components/Button";
import Button2 from "./../../common/components/Button2";
import CustomModal from "../../common/components/CustomModal";
import LoadingSpinner from "./../../common/components/LoadingSpinner";
import "./styles/diaryFormPage.style.css";

const DiaryFormPage = () => {
  const { diaryId } = useParams();
  const dispatch = useDispatch();

  const [formValues, setFormValues] = useState({
    selectedDate: "",
    mood: "",
    title: "",
    image: "",
    content: "",
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState(null);

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
      setFormValues({
        selectedDate: selectedDiary.selectedDate
          ? new Date(selectedDiary.selectedDate).toISOString().split("T")[0]
          : "",
        mood: selectedDiary.mood?.id || "",
        title: selectedDiary.title || "",
        image: selectedDiary.image || "",
        content: selectedDiary.content || "",
      });
    }
  }, [diaryId, selectedDiary]);

  useEffect(() => {
    dispatch(fetchAllMoods());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "selectedDate") {
      const today = new Date().toISOString().split("T")[0];
      if (value > today) {
        alert("미래 날짜는 선택할 수 없습니다.");
        return;
      }
    }
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const today = new Date().toISOString().split("T")[0];
    if (formValues.selectedDate > today) {
      alert("미래 날짜는 선택할 수 없습니다. 날짜를 다시 선택해주세요.");
      return;
    }

    setModalMessage(
      diaryId
        ? "해당 내용으로 다이어리를 수정하시겠습니까?"
        : "다이어리를 등록하시겠습니까?"
    );
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = (event) => {
    const payload = { ...formValues };
    const action = diaryId
      ? updateDiary({ diaryId, payload })
      : createDiary(payload);

    dispatch(action)
      .unwrap()
      .then(() => {
        setModalMessage(
          diaryId
            ? "다이어리가 성공적으로 수정되었습니다"
            : "다이어리가 성공적으로 등록되었습니다"
        );
        setShowConfirmModal(false);
        setShowSuccessModal(true);
      })
      .catch((error) => {
        console.error("Failed to submit diary:", error);
        setModalMessage(
          `Failed to ${diaryId ? "update" : "create"} diary: ${
            error.message || "An error occurred."
          }`
        );
        setShowConfirmModal(false);
      });
  };

  const handleImageUpload = (url) => {
    setFormValues((prev) => ({ ...prev, image: url }));
  };

  const handleClose = () => {
    setModalMessage(null);
    setShowConfirmModal(false);
    setShowSuccessModal(false);
  };

  return (
    <div className="container p-4">
      {diaryLoading ? (
        <div className="d-flex justify-content-center">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <h1 className="mb-5 text-center">
            {diaryId ? "Edit Diary" : "Write a Diary"}
          </h1>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6} className="diary-form__group--responsive">
                <Form.Group controlId="selectedDate">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="selectedDate"
                    value={formValues.selectedDate}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="mood">
                  <Form.Label>Today's Mood</Form.Label>
                  <Form.Select
                    name="mood"
                    value={formValues.mood}
                    onChange={handleChange}
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
                name="title"
                placeholder="Enter diary title"
                value={formValues.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="image" className="mb-3">
              <Form.Label className="pe-2">Attach an Image</Form.Label>
              <CloudinaryUploadWidget uploadImage={handleImageUpload} />
              {formValues.image && (
                <div className="diary-form__img-box">
                  <img
                    src={formValues.image}
                    alt="Uploaded preview"
                    className="mb-2"
                    style={{
                      width: "100%",
                      maxHeight: "200px",
                      objectFit: "contain",
                    }}
                  />
                  <div className="diary-form__btn-box">
                    <Button2
                      className="diary-form__btn__img-remove"
                      onClick={() =>
                        setFormValues((prev) => ({ ...prev, image: "" }))
                      }
                    >
                      사진 제거
                    </Button2>
                  </div>
                </div>
              )}
            </Form.Group>

            <Form.Group controlId="content" className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                name="content"
                rows={6}
                placeholder="Write your diary entry here..."
                value={formValues.content}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group as={Row} className="mt-4">
              <Col className="d-flex justify-content-end">
                <Button type="submit">{diaryId ? "수정" : "작성"}</Button>
              </Col>
            </Form.Group>
          </Form>
        </>
      )}
      {showConfirmModal && (
        <CustomModal
          message={modalMessage}
          onClose={handleClose}
          onConfirm={handleConfirmSubmit}
          showCancelButton={true}
        />
      )}
      {showSuccessModal && (
        <CustomModal
          message={modalMessage}
          onClose={handleClose}
          redirectTo={diaryId ? `/diaries/${diaryId}` : "/diaries"}
          showCancelButton={false}
        />
      )}
    </div>
  );
};

export default DiaryFormPage;
