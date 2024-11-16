import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "./../../common/components/Button";

const DiaryFormPage = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [mood, setMood] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [content, setContent] = useState("");

  const moods = [
    { id: "happy", label: "Happy" },
    { id: "sad", label: "Sad" },
    { id: "excited", label: "Excited" },
    { id: "calm", label: "Calm" },
    { id: "angry", label: "Angry" },
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("selectedDate", selectedDate);
    formData.append("mood", mood);
    formData.append("title", title);
    formData.append("image", image);
    formData.append("content", content);

    console.log("Form submitted", {
      selectedDate,
      mood,
      title,
      image,
      content,
    });
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Write a Diary</h1>
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
                {moods.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
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
          <Form.Control type="file" onChange={handleImageUpload} required />
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

        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
};

export default DiaryFormPage;
