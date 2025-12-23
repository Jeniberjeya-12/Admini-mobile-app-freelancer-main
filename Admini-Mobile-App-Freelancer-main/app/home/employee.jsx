import React, { useState } from "react";
import { useRouter } from "expo-router";
import {View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Modal} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function UsersScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [employees, setEmployees] = useState([
    {
      id: "1",
      name: "Surya",
      email: "surya.ventures0@gmail.com",
      role: "Non Technical",
      skill: "Market Research & Content Creation",
      status: "active",
    },
    {
      id: "2",
      name: "Aruna",
      email: "aruna.dexa@gmail.com",
      role: "Technical",
      skill: "Tech Lead",
      status: "active",
    },
    {
      id: "3",
      name: "Anton Richards",
      email: "richards.dexa@gmail.com",
      role: "Non Technical",
      skill: "Operations Manager",
      status: "active",
    },
    {
      id: "4",
      name: "Tamil Selvi",
      email: "tamilselvi2015n@gmail.com",
      role: "Non-Technical",
      skill: "Marketing Research & Content Creation",
      status: "active",
    },
    {
      id: "5",
      name: "Amala",
      email: "amalajerome3@gmail.com",
      role: "Technical",
      skill: "Python Developer",
      status: "active",
    },
    {
      id: "6",
      name: "Cruz Stani Thanis",
      email: "stanithanis@gmail.com",
      role: "Non-Technical",
      skill: "Marketing Research & Content Creation",
      status: "active",
    },
    {
      id: "7",
      name: "Tharik",
      email: "mohammedtharik165@gmail.com",
      role: "Non-Technical",
      skill: "UI/UX Designer",
      status: "active",
    },
  ]);

  /* 🔹 Add Employee Form State */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [skill, setSkill] = useState("");

  /* 🔹 Search Filter */
  const filteredEmployees = employees.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase())
  );

  /* 🔹 Add Employee */
  const handleAddEmployee = () => {
    if (!name || !email) return;

    const newEmployee = {
      id: Date.now().toString(),
      name,
      email,
      role,
      skill,
      status: "active",
    };

    setEmployees([...employees, newEmployee]);

    setName("");
    setEmail("");
    setRole("");
    setSkill("");
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.topHeader}>
         <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#ffffffff" />
          </TouchableOpacity>
        <Text style={styles.headerTitle}>Employee List</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#9ca3af" />
        <TextInput
          placeholder="Search users..."
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Employees Row */}
      <View style={styles.employeeRow}>
        <Text style={styles.employeeTitle}>
          Employees ({filteredEmployees.length})
        </Text>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setIsModalVisible(true)}
        >
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Employee List */}
      <FlatList
        data={filteredEmployees}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.name.charAt(0)}
              </Text>
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>

              <View style={styles.badgeRow}>
                <View style={styles.badgeGray}>
                  <Text style={styles.badgeText}>{item.role}</Text>
                </View>
                <View style={styles.badgeBlue}>
                  <Text style={styles.badgeText}>{item.skill}</Text>
                </View>
              </View>

              <View style={styles.badgeGreen}>
                <Text style={styles.badgeText}>active</Text>
              </View>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color="#9ca3af"
            />
          </View>
        )}
      />

      {/* 🔹 Add Employee Modal */}
      <Modal transparent visible={isModalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Employee</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={22} color="#fff" />
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Name"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              placeholder="Email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              placeholder="Role"
              style={styles.input}
              value={role}
              onChangeText={setRole}
            />
            <TextInput
              placeholder="Skill"
              style={styles.input}
              value={skill}
              onChangeText={setSkill}
            />

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleAddEmployee}
            >
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },

  topHeader: {
    backgroundColor: "#0ea5e9",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e5e7eb",
    margin: 16,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    padding: 10,
  },

  employeeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  employeeTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0ea5e9",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addBtnText: {
    color: "#fff",
    marginLeft: 4,
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  cardContent: {
    flex: 1,
  },
  name: {
    fontWeight: "600",
    fontSize: 14,
  },
  email: {
    color: "#6b7280",
    fontSize: 12,
    marginBottom: 6,
  },

  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  badgeGray: {
    backgroundColor: "#e5e7eb",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  badgeBlue: {
    backgroundColor: "#dbeafe",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 6,
  },
  badgeGreen: {
    backgroundColor: "#dcfce7",
    alignSelf: "flex-start",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  badgeText: {
    fontSize: 11,
    color: "#111827",
  },

  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "center",
  alignItems: "center",
},
modalCard: {
  width: "90%",
  backgroundColor: "#fff",
  borderRadius: 16,
  padding: 20,
},
modalHeader: {
  backgroundColor: "#0ea5e9",
  padding: 14,
  borderRadius: 12,
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 15,
},
modalTitle: {
  color: "#fff",
  fontWeight: "600",
  fontSize: 16,
},
input: {
  borderWidth: 1,
  borderColor: "#e5e7eb",
  borderRadius: 10,
  padding: 12,
  marginBottom: 12,
},
submitBtn: {
  backgroundColor: "#0ea5e9",
  paddingVertical: 14,
  borderRadius: 10,
  alignItems: "center",
  marginTop: 10,
},
submitText: {
  color: "#fff",
  fontWeight: "600",
},

});
