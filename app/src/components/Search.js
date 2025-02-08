import { StyleSheet, TextInput, View } from "react-native";
import { useState } from "react";
import { Entypo } from "@expo/vector-icons";

const Search = ({ data, setFilteredData }) => {
  const [searchText, setSearchText] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <View
      style={[styles.searchContainer, searchFocused && styles.focusedInput]}
    >
      <View style={{ flex: 1 }}>
        <TextInput
          placeholder="Search"
          style={styles.input}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholderTextColor="#94A3B8"
          value={searchText}
          onChangeText={(text) => {
            setFilteredData(
              data.filter((item) =>
                item.name.toLowerCase().includes(text.toLowerCase())
              )
            );
            setSearchText(text);
          }}
        />
      </View>
      <Entypo
        name="magnifying-glass"
        size={25}
        color="#07054a"
        style={styles.searchIcon}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 16,
  },
  input: {
    width: "100%",
    height: 50,
    fontSize: 16,
    borderBottomWidth: 2,
    borderColor: "#E2E8F0",
    marginLeft: 12,
  },
  focusedInput: {
    borderColor: "#07054a",
    borderWidth: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
});
