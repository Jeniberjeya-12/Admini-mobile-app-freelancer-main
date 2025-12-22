import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  Modal, TextInput, ScrollView, FlatList 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [activeTab, setActiveTab] = useState("Employee");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [employees, setEmployees] = useState([]);
  
  // Form State
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('');

  const handleAddEmployee = () => {
    const newEmployee = { id: Date.now().toString(), name, employeeId, phoneNumber, role };
    setEmployees([...employees, newEmployee]);
    
    // Reset and Close
    setName(''); setEmployeeId(''); setPhoneNumber(''); setRole('');
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={22} color="#2563eb" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Employee List</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {[].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Employee List Content */}
      {activeTab === "Employee" && (
        <View style={{ flex: 1, padding: 20 }}>
          <View style={styles.row}>
            <Text>Total Number of Employees: {employees.length}</Text>
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={() => setIsModalVisible(true)}
            >
              <Text style={{ color: '#fff' }}>+ Add Employee</Text>
            </TouchableOpacity>
          </View>

          {employees.length === 0 ? (
            <Text style={styles.emptyText}>No employees found. Add your first employee.</Text>
          ) : (
            <FlatList
              data={employees}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.employeeCard}>
                  <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                  <Text>{item.role} | ID: {item.employeeId}</Text>
                </View>
              )}
            />
          )}
        </View>
      )}

      {/* Add Employee Modal */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Employee</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <Text>Name</Text>
              <TextInput style={styles.input} placeholder="Enter Name" onChangeText={setName} />
              <Text>Employee Id</Text>
              <TextInput style={styles.input} placeholder="Enter ID" onChangeText={setEmployeeId} />
              <Text>Phone Number</Text>
              <TextInput style={styles.input} placeholder="Enter Phone" keyboardType="phone-pad" onChangeText={setPhoneNumber} />
              <Text>Role</Text>
              <TextInput style={styles.input} placeholder="Enter Role" onChangeText={setRole} />
              
              <TouchableOpacity style={styles.submitButton} onPress={handleAddEmployee}>
                <Text style={{ color: 'white' }}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,
    backgroundColor: '#fff' },
  header: { flexDirection: 'row',
    alignItems: 'center',
    padding: 15 },
  headerTitle: { fontSize: 18,
     fontWeight: 'bold',
     marginLeft: 10 },
  tabsContainer: { flexDirection: 'row', 
    paddingHorizontal: 15, marginBottom: 10 },
  tab: { paddingVertical: 8, 
    paddingHorizontal: 15, 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: '#d1e3ff', 
    marginRight: 10 },
  activeTab: { backgroundColor: '#e0efff' },
  tabText: { color: '#2563eb' },
  activeTabText: { fontWeight: 'bold' },
  row: { flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 },
  addButton: { backgroundColor: '#00a8e8', 
    padding: 10, 
    borderRadius: 5 },
  emptyText: { textAlign: 'center', 
    marginTop: 50, 
    color: 'gray' },
  employeeCard: { padding: 15, 
    borderBottomWidth: 1, 
    borderColor: '#eee' },
  modalOverlay: { flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' },
  modalContent: { width: '90%', 
    backgroundColor: 'white', 
    borderRadius: 10, 
    overflow: 'hidden' },
  modalHeader: { backgroundColor: '#00a8e8', 
    padding: 15, 
    flexDirection: 'row',
    justifyContent: 'space-between' },
  modalTitle: { color: 'white', 
    fontWeight: 'bold' },
  form: { padding: 20 },
  input: { borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 5, 
    padding: 10, 
    marginVertical: 10 },
  submitButton: { backgroundColor: '#00a8e8', 
    padding: 15, 
    borderRadius: 5, 
    alignItems: 'center', 
    marginTop: 10 }
});