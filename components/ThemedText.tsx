import React from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
};

export default function ThemedText({ style, lightColor, darkColor, ...props }: ThemedTextProps) {
  return (
    <Text
      style={[
        styles.text,
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#333',
    fontSize: 16,
  },
});
