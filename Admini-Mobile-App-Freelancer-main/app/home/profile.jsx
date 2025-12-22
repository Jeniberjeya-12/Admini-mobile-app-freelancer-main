import React, { useState } from "react";
import {View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, Alert,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

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
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* 🔹 Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* 🔹 Profile Picture */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Profile Picture</Text>

        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatarImg} />
            ) : (
              <Ionicons name="person" size={50} color="#9ca3af" />
            )}
          </View>

          <View style={styles.profileButtons}>
            <TouchableOpacity style={styles.primaryBtn} onPress={pickImage}>
              <Text style={styles.primaryBtnText}>Change Picture</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.outlineBtn} onPress={removeImage}>
              <Text style={styles.outlineBtnText}>Remove Picture</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: "#f8fafc",
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
  },

  profileButtons: {
    marginLeft: 16,
  },

  label: {
    fontSize: 13,
    marginBottom: 6,
    color: "#374151",
  },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
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
