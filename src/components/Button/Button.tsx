import { Button as AntdButton, type ButtonProps } from 'antd';
import React from 'react';
import { motion } from 'framer-motion';
import './Button.scss';

const Button: React.FC<ButtonProps> = (props) => {
  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -2, boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}
      whileTap={{ scale: 0.98, y: 0 }}
      whileFocus={{ scale: 1.03, y: -1 }}
      transition={{ duration: 0.18, type: 'spring', stiffness: 260 }}
      style={{ display: 'inline-block' }}
    >
      <AntdButton
        {...props}
        className={`button-animated ${props.className || ''}`.trim()}
      />
    </motion.div>
  );
};

export default Button;
