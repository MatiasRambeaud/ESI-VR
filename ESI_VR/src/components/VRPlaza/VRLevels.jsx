import React, { useEffect, useMemo, useRef, useState } from 'react';
import { VRPlaza } from './VRPlaza';
import questionsData from '../../data/questions.json';

const pickRandomIndices = (total, count) => {
  const indices = Array.from({ length: total }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, Math.min(count, total));
};

const VRLevels = ({ onFinish }) => {
  const [order, setOrder] = useState([]);
  const [pos, setPos] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [locked, setLocked] = useState(false);

  const box1Ref = useRef(null);
  const box2Ref = useRef(null);
  const box3Ref = useRef(null);

  const questions = useMemo(() => {
    // Validate format; fallback to empty array if invalid
    if (!Array.isArray(questionsData)) return [];
    return questionsData.filter(q => q && typeof q.question === 'string' && Array.isArray(q.options) && q.options.length === 3 && typeof q.answerIndex === 'number');
  }, []);

  const maxRounds = 5;

  const current = useMemo(() => {
    if (!order.length || pos >= order.length) return null;
    return questions[order[pos]];
  }, [order, pos, questions]);

  useEffect(() => {
    const total = questions.length;
    setOrder(pickRandomIndices(total, maxRounds));
    setPos(0);
    setFeedback(null);
    setLocked(false);
  }, [questions.length]);

  useEffect(() => {
    const handleClick = (choiceIndex) => {
      if (!current || locked) return;
      setLocked(true);
      const isCorrect = choiceIndex === current.answerIndex;
      setFeedback(isCorrect ? 'correct' : 'wrong');
      setTimeout(() => {
        const nextPos = pos + 1;
        if (nextPos >= maxRounds) {
          setLocked(false);
          setFeedback(null);
          if (onFinish) onFinish();
        } else {
          setPos(nextPos);
          setLocked(false);
          setFeedback(null);
        }
      }, 2000);
    };

    const h1 = () => handleClick(0);
    const h2 = () => handleClick(1);
    const h3 = () => handleClick(2);

    if (box1Ref.current) box1Ref.current.addEventListener('click', h1);
    if (box2Ref.current) box2Ref.current.addEventListener('click', h2);
    if (box3Ref.current) box3Ref.current.addEventListener('click', h3);

    return () => {
      if (box1Ref.current) box1Ref.current.removeEventListener('click', h1);
      if (box2Ref.current) box2Ref.current.removeEventListener('click', h2);
      if (box3Ref.current) box3Ref.current.removeEventListener('click', h3);
    };
  }, [current, locked, pos, onFinish]);

  const titleBg = feedback === 'correct' ? '#4CAF50' : feedback === 'wrong' ? '#F44336' : '#f0f0f0';

  const screen = (
    <a-entity position="0 0 0.01">
      <a-plane color="#f0f0f0" width="1.8" height="1.5" position="0 0 -0.01" opacity="0.9"></a-plane>

      <a-plane color={titleBg} width="1.6" height="0.4" position="0 0.55 0"></a-plane>
      <a-text value={current ? current.question : 'Cargando...'} position="0 0.55 0.01" color="#222" align="center" width="1.5"></a-text>

      <a-box ref={box1Ref} position="0 0.1 0" width="1.4" height="0.22" depth="0.05" color="#ffffff" class="clickable">
        <a-text value={current ? current.options[0] : ''} position="0 0 0.026" color="#000" align="center" width="1.3"></a-text>
      </a-box>

      <a-box ref={box2Ref} position="0 -0.2 0" width="1.4" height="0.22" depth="0.05" color="#ffffff" class="clickable">
        <a-text value={current ? current.options[1] : ''} position="0 0 0.026" color="#000" align="center" width="1.3"></a-text>
      </a-box>

      <a-box ref={box3Ref} position="0 -0.5 0" width="1.4" height="0.22" depth="0.05" color="#ffffff" class="clickable">
        <a-text value={current ? current.options[2] : ''} position="0 0 0.026" color="#000" align="center" width="1.3"></a-text>
      </a-box>

      <a-text value={`Pregunta ${Math.min(pos + 1, maxRounds)} / ${maxRounds}`} position="0 -0.8 0" color="#666" align="center" width="1.8"></a-text>
    </a-entity>
  );

  return (
    <VRPlaza
      onBack={onFinish}
      onProfile={() => {}}
      onSelectLevel={() => {}}
    >
      {screen}
    </VRPlaza>
  );
};

export default VRLevels;
