import React from 'react';
import { sanitizeText } from '../../utils/sanitizeText';

export const SafeText = ({ value, children, ...rest }) => {
  const safe = sanitizeText(value);
  return (
    <a-text value={safe} {...rest}>
      {children}
    </a-text>
  );
};
