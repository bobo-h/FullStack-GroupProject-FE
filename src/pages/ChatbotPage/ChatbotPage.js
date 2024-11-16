import React, { useState } from 'react';
import { Form, Container, Row, Col} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createChatbot } from '../../features/chatbot/chatbotSlice';
import "./style/chatbot.style.css";
import Button from "../../common/components/Button";
import PersonalityMBTI from './component/PersonalityMBTI/PersonalityMBTI';
import Spinner from 'react-bootstrap/Spinner';
import Button2 from '../../common/components/Button2';
import Alert from '../../common/components/Alert';
//import PersonalityBox from './component/PersonalityBox/PersonalityBox';

// ChatbotCreation 컴포넌트
const ChatbotCreation = () => {
    const [name, setName] = useState('');
    const [personality, setPersonality] = useState('');
    const [isDirectInput, setIsDirectInput] = useState(true);
    const [showAlert, setShowAlert] = useState(false);

    const dispatch = useDispatch();
    const { loading, registrationError, success } = useSelector((state) => state.chatbot); 

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     dispatch(createChatbot({ name, personality }));
//   };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        setShowAlert(true);
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
      };


    const handlePersonalityChange = (selectedPersonality) => {
        setPersonality(selectedPersonality);
    };

    const handleInputTypeChange = (inputType) => {
        setIsDirectInput(inputType);
        setPersonality(''); 
    };

  return (
    <div className='chatbot-create-modal'>
        {showAlert && (
        <Alert 
          onClose={handleCloseAlert} 
          redirectTo="/"  
        >
          Form submitted successfully!
        </Alert>
      )}
        <Container className=" d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Row className="text-center chatbot-create-content">
            <h3 className='create-modal-title'>입양 서류</h3>
                {/* <Form onSubmit={handleSubmit}> */}
                <Col lg={3} className="">
                    <img 
                        className='chatbot-image-size'
                        src="data:image/png;base64,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" 
                        alt="Cute Cat" 
                    />
                </Col>
                <Col>
                <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formName">
                            <Row className="align-items-center">
                            {registrationError && <Alert variant="danger">{registrationError}</Alert>}
                            {success && <Alert variant="success">챗봇이 성공적으로 생성되었습니다!</Alert>}
                                <Col xs="auto">
                                    <Form.Label>챗봇 이름</Form.Label>
                                </Col>
                                <Col lg={6}>
                                    <Form.Control
                                        type="text"
                                        placeholder="이름을 입력하세요"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPersonality">
                            <Row className="align-items-center">
                                <Col xs="auto">
                                    <Form.Label>챗봇 성격</Form.Label>
                                </Col>
                                <Col className='btn-gap'>
                                    <Button2 
                                        variant={isDirectInput ? 'outline-secondary' : 'primary'} 
                                        onClick={() => handleInputTypeChange(true)}>
                                        직접 입력
                                    </Button2>
                                    <Button 
                                        variant={isDirectInput ? 'primary' : 'outline-secondary'} 
                                        onClick={() => handleInputTypeChange(false)}>
                                        성격 선택
                                    </Button>
                                </Col>
                                <Row className='personality-area'>
                                    {!isDirectInput && (
                                        <Form.Control
                                        placeholder="선택한 성격 보여줌"
                                        value={personality}
                                        onChange={(e) => setPersonality(e.target.value)}
                                        required
                                        disabled
                                    />
                                    )}
                                    {isDirectInput && (
                                        <Form.Control
                                            as="textarea"
                                            placeholder="성격을 직접 입력하세요"
                                            value={personality}
                                            onChange={(e) => setPersonality(e.target.value)}
                                            required
                                        />
                                    )}
                                </Row>
                                <Row className="align-items-center text-center">
                                {!isDirectInput && (
                                    <PersonalityMBTI onPersonalitySelect={handlePersonalityChange} />
                                    //<PersonalityBox onPersonalitySelect={handlePersonalityChange}/>
                                    )}
                                </Row>
                                <Col className="personality-area">
                                    <Button variant="primary" type="submit" disabled={loading} className="w-auto">
                                        {loading ? '생성 중...' : '입양하기'}
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    </div>
  );
};

export default ChatbotCreation;
