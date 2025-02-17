import { View, Text, TextProps } from 'react-native';
import React from 'react';

interface Props extends TextProps {
  text: string;
}

const AppText: React.FC<Props> = ({ text, style, ...rest }) => {
  return (
    <Text style={style} {...rest}>
      {text}
    </Text>
  );
};

export default AppText;
