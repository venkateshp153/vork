import { Text, TextProps } from 'react-native';
import React, { forwardRef } from 'react';

interface Props extends TextProps {
  text: string;
}

const AppText = forwardRef<Text, Props>(({ text, style, ...rest }, ref) => {
  return (
    <Text style={style} ref={ref} {...rest}>
      {text}
    </Text>
  );
});

export default AppText;
