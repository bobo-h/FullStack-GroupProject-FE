import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { useDispatch} from "react-redux";
import Button from "../../../../../common/components/Button"
import { addUserComment } from "../../../../../features/comment/commentSlice";

const CommentForm = ({diaryId}) => {
    const [comment, setComment] = useState("");
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (comment.trim()) {
            dispatch(addUserComment({ diaryId, content: comment }));
            setComment("");
          }
    };

    return (
    <Container>
      <Row>
        <Col lg={2}>
            유저 이미지
          {/* <img alt="User" src="" /> */}
        </Col>
        <Col>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="commentInput">
              <Form.Control
                type="text"
                placeholder="댓글 추가..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-2">
              등록
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};


export default CommentForm;