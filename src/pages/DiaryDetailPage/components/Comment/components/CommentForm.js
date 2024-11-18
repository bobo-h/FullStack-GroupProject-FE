import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { useDispatch} from "react-redux";
import Button from '../../../../../common/components/Button';

const CommentForm = () => {
    const dispatch = useDispatch();

    // onSubmit={handleSubmit}
    return(
        <div>
            <Container>
                <Col lg={2}>
                    <img>유저 이미지</img>
                </Col>
                <Col>
                    <Form className="form-container" >
                            {/* <Form.Control
                                // onChange={handleChange}
                                type="string"
                                placeholder="댓글 추가"
                                required
                                value={formData.id}
                            /> */}
                        <Button>등록</Button>
                    </Form>
                </Col>

            </Container>
            
        </div>
    );
};

export default CommentForm;