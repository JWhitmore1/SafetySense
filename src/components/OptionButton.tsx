import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';

interface OptionButtonProps {
  title: string;
  imageSource: any;
  onPress: () => void;
}

const OptionButton: React.FC<OptionButtonProps> = ({ title, imageSource, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Image source={imageSource} style={styles.image} />
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    marginVertical: 5,
    borderRadius: 8,
    width: '90%',
    alignSelf: 'center',
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 15,
    backgroundColor: '#ddd',  // Placeholder for image background
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OptionButton;