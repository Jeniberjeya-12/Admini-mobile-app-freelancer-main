import React, { useState } from "react";
import {View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, Alert,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
// import * as ImagePicker from "expo-image-picker";

export default function SettingsScreen() {
  const router = useRouter();

  /* Tabs */
  const tabs = ["Profile"];
  const [activeTab, setActiveTab] = useState("Profile");

  /* Profile Image */
  const [profileImage, setProfileImage] = useState(null);

  /* Image Picker */
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Allow gallery access");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
  };

  return (
    <ScrollView style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#2563eb" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      {/* 🔹 Profile Picture */}
      <View style={styles.profileHeaderContainer}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarMain}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatarImg} />
            ) : (
              <Ionicons name="person" size={60} color="#9ca3af" />
            )}
          </View>
          
          {/* Floating Edit Icon */}
          <TouchableOpacity style={styles.editIconBadge} onPress={pickImage}>
            <Ionicons name="create-outline" size={20} color="#2563eb" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔹 Personal Information */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <Input label="Company Name" placeholder="Enter your Company Name" />
        <Input label="Email" placeholder="Enter your Email" />
        <Input label="Industry Type" placeholder="Select Industry" />
        <Input label="WhatsApp Number" placeholder="+91" />
        <Input label="City" placeholder="Enter your City" />
        <Input
          label="Company Description"
          placeholder="Add something about your company"
          multiline
        />
      </View>

      {/* 🔹 Social Media */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Social Media Handles</Text>

        <Input label="LinkedIn Profile" placeholder="LinkedIn URL" />
        <Input label="Instagram Profile" placeholder="Instagram URL" />
        <Input label="Facebook Profile" placeholder="Facebook URL" />
        <Input label="Reddit Profile" placeholder="Reddit URL" />
        <Input label="X Profile" placeholder="X (Twitter) URL" />
      </View>

      {/* 🔹 Actions */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.primaryBtnLarge}
          onPress={() => Alert.alert("Saved", "Profile updated successfully")}
        >
          <Text style={styles.primaryBtnText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.outlineBtnLarge}>
          <Text style={styles.outlineBtnText}>Discard</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* 🔹 Reusable Input */
const Input = ({ label, multiline = false, ...props }) => (
  <View style={{ marginBottom: 14 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && styles.textArea]}
      multiline={multiline}
      {...props}
    />
  </View>
);

/* 🔹 Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
    padding: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 12,
  },

  tabsContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#bfdbfe",
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: "#e0f2fe",
  },
  tabText: {
    fontSize: 13,
    color: "#1e3a8a",
  },
  activeTabText: {
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    // Subtle shadow for the card
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  profileHeaderContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  avatarWrapper: {
    position: "relative", 
  },
  avatarMain: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#fff",
    // Shadow for elevation effect
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  avatarImg: {
    width: "100%",
    height: "100%",
  },
  editIconBadge: {
    position: "absolute",
    right: 0,
    top: 5,
    backgroundColor: "#fff",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1e293b", // Darker text for readability
  },

  input: {
    backgroundColor: "#f8fafc", // Light grey background for input
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12, // Rounded corners like the screenshot
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    color: "#334155",
  },
  helperText: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: -8,
    marginBottom: 15,
    marginLeft: 4,
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
  },

  primaryBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  primaryBtnLarge: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "600",
  },

  outlineBtn: {
    borderWidth: 1,
    borderColor: "#2563eb",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  profileButtons: {
    flexDirection: "row", 
    marginLeft: 16,
    gap: 12,
  },

  outlineBtnLarge: {
    borderWidth: 1,
    borderColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
    marginLeft: 12,
  },
  outlineBtnText: {
    color: "#2563eb",
    fontWeight: "600",
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
  },
});
