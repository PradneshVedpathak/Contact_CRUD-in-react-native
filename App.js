import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Button,
  TextInput,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import ContactAppScreen from "./src/screen/ContactAppScreen";
import { useState, useRef } from "react";

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const getContacts = useRef();

  const openModal = () => {
    setShowModal(true);
  };

  const saveData = async () => {
    let result = await fetch(
      "https://proud-pear-bonobo.cyclic.app/addContact",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, phoneNumber }),
      }
    );
    result = await result.json();
    if (result) {
      setShowModal(false);
      getContacts.current.getAPI();
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Contact Manager</Text>
        <TouchableOpacity style={styles.addicon} onPress={() => openModal()}>
          <Icon name="add" color={"#FFF"} size={30}></Icon>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.contacts}>
          <ContactAppScreen ref={getContacts} />
        </View>
      </ScrollView>
      <Modal visible={showModal} transparent={true}>
        <View style={styles.centerModal}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Add Contact</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="Enter first name"
              value={firstName}
              onChangeText={(fText) => setFirstName(fText)}
            />
            <TextInput
              style={styles.inputBox}
              placeholder="Enter last name"
              value={lastName}
              onChangeText={(lText) => setLastName(lText)}
            />
            <TextInput
              style={styles.inputBox}
              keyboardType="numeric"
              placeholder="Enter contact number"
              value={phoneNumber}
              onChangeText={(cNumber) => setPhoneNumber(cNumber)}
            />
            <Pressable style={styles.button} onPress={saveData}>
              <Text style={styles.text}>Submit</Text>
            </Pressable>

            <Pressable
              style={styles.closeBtn}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.text}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8EAED",
  },
  header: {
    position: "fixed",
    width: "100%",
    paddingBottom: 30,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTitle: {
    top: 0,
    paddingTop: 70,
    fontSize: 30,
    fontWeight: "bold",
  },
  contacts: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  addicon: {
    top: 65,
    height: 50,
    width: 50,
    backgroundColor: "#FFF",
    borderRadius: 25,
    elevation: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#55BCF6",
  },
  centerModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(50,50,50,0.6)",
  },
  modalContainer: {
    backgroundColor: "#FFF",
    height: 350,
    width: 400,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.7,
    elevation: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    top: 15,
    marginBottom: 35,
  },
  inputBox: {
    borderColor: "#55BCF6",
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
    width: 250,
    height: 35,
    fontSize: 15,
    paddingLeft: 10,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "green",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  closeBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "gray",
  },
});
