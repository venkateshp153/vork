import { 
  View, 
  Text, 
  TextInput, 
  Image, 
  ImageSourcePropType, 
  StyleProp, 
  ViewStyle, 
  TextStyle, 
  TextInputProps 
} from "react-native";
import React from "react";
import { colors } from "../assets/styles/colors";

interface AppInputProps extends Omit<TextInputProps, "style"> {
  label: string;
  showLabel?: boolean;
  activeBorder?: boolean;
  showBorder?: boolean;
  inputIcon?: ImageSourcePropType;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  errorLabel?: string;
}

const AppInput: React.FC<AppInputProps> = ({
  label,
  showLabel = false,
  activeBorder = false,
  showBorder = true,
  inputIcon,
  containerStyle,
  inputStyle,
  errorLabel,
  ...textInputProps
}) => {
  return (
    <View style={[{ width: "95%", alignSelf: "center", marginBottom: 5 }, containerStyle]}>
      {showLabel && (
        <View style={{ left: 10, height: 20, width: "75%" }}>
          <Text style={{ color: colors.textColor }}>{label}</Text>
        </View>
      )}

      <View
        style={{
          height: 40,
          margin: 2,
          paddingLeft: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignSelf: "center",
          width: "100%",
          borderBottomColor: activeBorder && showBorder ? colors.appThemeColor : colors.error,
          borderBottomWidth: 1,
        }}
      >
        {inputIcon && (
          <View
            style={{
              flex: 0.1,
              alignSelf: "center",
              borderRightColor: "lightgray",
              borderRightWidth: 1,
              paddingRight: 5,
            }}
          >
            <Image source={inputIcon} style={{ width: 20, height: 20, alignSelf: "center" }} />
          </View>
        )}

        <View style={{ flex: 0.9 }}>
          <TextInput
            style={[{
              width: "90%",
              height: 40,
              textAlign: "left",
              paddingLeft: 10,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "transparent",
            }, inputStyle]}
            placeholder={label}
            placeholderTextColor={colors.inActive}
            {...textInputProps}
          />
        </View>
      </View>

      {errorLabel && <Text style={{ color: colors.error, alignSelf: "flex-end" }}>{errorLabel}</Text>}
    </View>
  );
};

export default AppInput;
