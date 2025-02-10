import {View, Text} from 'react-native';
import React from 'react';
import {TextProps} from 'react-native';

interface Props extends TextProps {
  text: String;
}
const AppText = (props: Props) => {
  return <Text style={props.style}>{props.text}</Text>;
};

export default AppText;
