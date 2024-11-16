import React from 'react';
import Button2 from '../../../../common/components/Button2';


const PersonalityBtn = ({ onPersonalitySelect }) => {
    const personalities = [
      'ENTP', 'ENFP', 'ENFJ', 'ENTJ', 'ESTP', 'ESFP', 'ESFJ', 'ESTJ', 
      'ISFP', 'ISFP', 'ISFJ', 'ISTJ', 'INFJ', 'INFP', 'INTJ', 'INTP'
    ];

  return (
    <div className="d-flex flex-wrap">
      {personalities.map((personality, index) => (
        <Button2
          key={index}
          variant="outline-primary" 
          onClick={() => onPersonalitySelect(personality)} 
          className="m-2"
        >
          {personality}
        </Button2>
      ))}
    </div>
  );
};

export default PersonalityBtn;
