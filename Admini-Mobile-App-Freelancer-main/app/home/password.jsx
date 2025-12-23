import React, { useState } from 'react';
import {StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SettingsScreen = () => {
  const router = useRouter();

  const tabs = ['Change Password'];

  // 🔹 Password state
  const [passwords, setPasswords] = useState({
    old: '',
    new: '',
    confirm: '',
  });

  // 🔹 Eye toggle states
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // 🔹 Submit handler
  const handleSubmit = () => {
    if (!passwords.old || !passwords.new || !passwords.confirm) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      Alert.alert("Error", "Check the password");
      return;
    }

    Alert.alert(
      "Success",
      "Password successfully changed",
      [
        {
          text: "OK",
          onPress: () => {
            setPasswords({ old: '', new: '', confirm: '' });
          },
        },
      ]
    );
  };

  return (
  <SafeAreaView style={styles.safe}>
    <ScrollView contentContainerStyle={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2563eb" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.cardHeaderText}>Change Password</Text>

        {/* Old Password */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Old password"
            secureTextEntry={!showOld}
            value={passwords.old}
            onChangeText={(val) =>
              setPasswords({ ...passwords, old: val })
            }
          />
          <TouchableOpacity onPress={() => setShowOld(!showOld)}>
            <Ionicons
              name={showOld ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>

        {/* New Password */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="New password"
            secureTextEntry={!showNew}
            value={passwords.new}
            onChangeText={(val) =>
              setPasswords({ ...passwords, new: val })
            }
          />
          <TouchableOpacity onPress={() => setShowNew(!showNew)}>
            <Ionicons
              name={showNew ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirm password"
            secureTextEntry={!showConfirm}
            value={passwords.confirm}
            onChangeText={(val) =>
              setPasswords({ ...passwords, confirm: val })
            }
          />
          <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
            <Ionicons
              name={showConfirm ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>

        {/* Submit */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>Update Password</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  </SafeAreaView>
);
};

export default SettingsScreen;

/* 🔹 Styles */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    paddingBottom: 30,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
    color: '#111827',
  },

  /* Card */
  card: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },

  cardHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
    marginBottom: 16,
  },

  /* Inputs */
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },

  /* Button */
  submitBtn: {
    backgroundColor: '#2563EB',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
