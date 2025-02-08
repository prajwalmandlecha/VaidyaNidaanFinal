import { Picker } from "@react-native-picker/picker";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";

const GenderPicker = () => {
  const [selectedGender, setSelectedGender] = useState("male");
  const { colors } = useTheme(); // Match RNE theme if needed

  return (
    <Picker
      selectedValue={selectedGender}
      onValueChange={(itemValue) => setSelectedGender(itemValue)}
      style={{ backgroundColor: colors.background }}
    >
      <Picker.Item label="Male" value="male" />
      <Picker.Item label="Female" value="female" />
      <Picker.Item label="Other" value="other" />
    </Picker>
  );
};

export default GenderPicker;