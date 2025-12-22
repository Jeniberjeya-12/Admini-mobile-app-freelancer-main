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
    <SafeAreaView style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.titleText}>Change Password</Text>
      </View>

      {/* 🔹 Tabs */}
      <View style={styles.tabWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab, index) => (
            <TouchableOpacity key={index} style={[styles.tabItem, styles.activeTab]}>
              <Text style={styles.tabLabel}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 🔹 Change Password Card */}
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>Change Password</Text>
          </View>

          <View style={styles.cardBody}>
            {/* Old Password */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your old password"
                secureTextEntry={!showOld}
                value={passwords.old}
                onChangeText={(val) =>
                  setPasswords({ ...passwords, old: val })
                }
              />
              <TouchableOpacity onPress={() => setShowOld(!showOld)}>
                <Ionicons
                  name={showOld ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            {/* New Password */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your new password"
                secureTextEntry={!showNew}
                value={passwords.new}
                onChangeText={(val) =>
                  setPasswords({ ...passwords, new: val })
                }
              />
              <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                <Ionicons
                  name={showNew ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter confirm password"
                secureTextEntry={!showConfirm}
                value={passwords.confirm}
                onChangeText={(val) =>
                  setPasswords({ ...passwords, confirm: val })
                }
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                <Ionicons
                  name={showConfirm ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            {/* Submit */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

/* 🔹 Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
  },
  backText: {
    color: '#0091D5',
    fontSize: 14,
    marginBottom: 8,
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0091D5',
  },
  tabWrapper: {
    borderWidth: 1,
    borderColor: '#B2E3FF',
    marginHorizontal: 20,
    borderRadius: 8,
    padding: 8,
    marginBottom: 40,
  },
  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#0091D5',
    marginRight: 10,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#B2E3FF',
  },
  tabLabel: {
    fontSize: 12,
    color: '#333',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 450,
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  cardHeader: {
    backgroundColor: '#B2E3FF',
    padding: 12,
  },
  cardHeaderText: {
    color: '#0091D5',
    fontWeight: '600',
    fontSize: 16,
  },
  cardBody: {
    padding: 25,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
  },
  submitBtn: {
    backgroundColor: '#0091D5',
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 10,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
