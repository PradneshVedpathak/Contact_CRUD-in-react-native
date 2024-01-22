import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Button,
} from "react-native";
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import Icon from "react-native-vector-icons/MaterialIcons";

const ContactAppScreen = forwardRef((props, ref) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(undefined);

  const openModal = (data) => {
    setShowModal(true);
    setSelectedContact(data);
  };
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useImperativeHandle(ref, () => getAPI());

  const getAPI = () => {
    fetch("https://proud-pear-bonobo.cyclic.app/allContacts")
      .then((response) => response.json())
      .then((result) => {
        setIsLoading(false);
        setData(result);
      });
  };

  const deleteContact = async (_id) => {
    setIsLoading(true);
    let result = await fetch(
      `https://proud-pear-bonobo.cyclic.app/removeContact/${_id}`,
      { method: "DELETE" }
    );
    result = await result.json();
    if (result) {
      setIsLoading(false);
      getAPI();
    }
  };

  useEffect(() => {
    getAPI();
  }, []);

  return (
    <View>
      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size={70} color="#55BCF6" />
        </View>
      ) : (
        <View>
          <FlatList
            data={data}
            renderItem={({ item }) => {
              return (
                <View style={styles.contacts}>
                  <View>
                    <Text style={styles.text}>
                      Name : {item.firstName} {item.lastName}
                    </Text>
                    <Text style={styles.text}>
                      Phone No : +91 {item.phoneNumber}
                    </Text>
                  </View>
                  <View style={styles.options}>
                    <TouchableOpacity onPress={() => deleteContact(item._id)}>
                      <Icon name="delete" style={styles.deleteIcon}></Icon>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openModal(item)}>
                      <Icon name="edit" style={styles.editIcon}></Icon>
                    </TouchableOpacity>
                  </View>
                  <Modal visible={showModal} transparent={true}>
                    <UpdateModal
                      setShowModal={setShowModal}
                      selectedContact={selectedContact}
                    />
                  </Modal>
                </View>
              );
            }}
          />
        </View>
      )}
    </View>
  );
});

const UpdateModal = (props) => {
  const [firstName, setFirstName] = useState(undefined);
  const [lastName, setLastName] = useState(undefined);
  const [phoneNumber, setPhoneNumber] = useState(undefined);

  useEffect(() => {
    if (props.selectedContact) {
      setFirstName(props.selectedContact.firstName);
      setLastName(props.selectedContact.lastName);
      setPhoneNumber(props.selectedContact.phoneNumber.toString());
    }
  }, [props.selectedContact]);

  const updateContact = async (id) => {
    let result = await fetch(
      `https://proud-pear-bonobo.cyclic.app/updateContact/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, phoneNumber }),
      }
    );
    result = await result.json();
    if (result) {
      setShowModal(false);
      getAPI();
    }
  };

  return (
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
          keyboardType="number"
          placeholder="Enter contact number"
          value={phoneNumber}
          onChangeText={(cNumber) => setPhoneNumber(cNumber)}
        />
        <Button
          title="Update"
          onPress={() => updateContact(props.selectedContact._id)}
          style={(marginBottom = 40)}
        />
        <Button title="Close" onPress={() => props.setShowModal(false)} />
      </View>
    </View>
  );
};

export default ContactAppScreen;

const styles = StyleSheet.create({
  contacts: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 15,
    fontWeight: "bold",
  },
  options: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deleteIcon: {
    color: "#f44336",
    fontSize: 23,
    marginHorizontal: 15,
  },
  editIcon: {
    color: "#55BCF6",
    fontSize: 23,
  },
  loader: {
    marginVertical: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  centerModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(50,50,50,0.6)",
  },
  modalContainer: {
    backgroundColor: "#FFF",
    height: 300,
    width: 300,
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
    fontWeight: "bold",
  },
});
