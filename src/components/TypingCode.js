import { motion } from 'framer-motion';
import { useState, useCallback, useEffect } from 'react';

const TypingCode = ({ text }) => {
  const [currentText, setCurrentText] = useState(text);

  const handleChangeText = () => {
    const newText = text.slice(0, -1);
    setCurrentText(newText);
  };

  const handleAnimationEnd = useCallback(() => {
    if (currentText === "I'm a Full Stack Developer") {
      setCurrentText("Designer");
    } else if (currentText === "Designer") {
      setCurrentText("Freelancer");
    } else {
      setCurrentText("I'm a Full Stack Developer");
    }
  }, [currentText]);

  useEffect(() => {
    handleAnimationEnd();
  }, [currentText, handleAnimationEnd]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      variants={{
        enter: { opacity: 1 },
        exit: { opacity: 0 },
      }}
      onAnimationEnd={handleAnimationEnd}
      speed={2000}
    >
      {currentText}
    </motion.div>
  );
};

export default TypingCode;
