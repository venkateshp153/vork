import {View, Text, TextInput, TextInputProps, Image} from 'react-native';
import React from 'react';
import {Colors} from '../utils/Colors';
interface Props extends TextInputProps {
  label: string;
  showLabel: boolean;
  activeBorder: boolean;
  showBorder: boolean;
  value: string;
  inputIcon?: any;
  style?: any;
  errorLabel?: string;
}

const AppInput = (props: Props) => {
  return (
    <View style={{width: '100%', alignSelf: 'center', marginBottom: 15}}>
      {props.showLabel && (
        <Text style={{color: Colors.textColor, marginBottom: 5}}>
          {props.label}
        </Text>
      )}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          borderWidth: 0,
          borderBottomColor:
            props.activeBorder && props.showBorder
              ? Colors.error
              : Colors.appThemeColor,
          borderBottomWidth: props.showBorder ? 1 : 0,
          paddingHorizontal: 10,
          backgroundColor: '#fff',
          borderRadius: 5,
          ...props.style,
        }}>
        {props.inputIcon && (
          <Image
            source={props.inputIcon}
            style={{
              width: 20,
              height: 20,
              marginRight: 10,
              tintColor: Colors.textColor,
            }}
            resizeMode="contain"
          />
        )}

        <TextInput
          style={{
            flex: 1,
            height: 40,
            color: 'gray',
            fontSize: 16,
          }}
          placeholder={props.label}
          {...props}
          placeholderTextColor={Colors.inActive}
        />
      </View>
      <View style={{height: 20}}>
        {props.errorLabel && (
          <Text
            style={{color: Colors.error, alignSelf: 'flex-end', fontSize: 12}}>
            {props.errorLabel}
          </Text>
        )}
      </View>
    </View>
  );
};

export default AppInput;
