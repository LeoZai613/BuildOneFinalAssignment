import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {initializeApp, getApps} from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAOoiO2KNEIKtvgq2CbhplkDsq2-5DATpI',
  authDomain: 'leon-firebase-authentication.firebaseapp.com',
  projectId: 'leon-firebase-authentication',
  storageBucket: 'leon-firebase-authentication.appspot.com',
  messagingSenderId: '766866374770',
  appId: '1:766866374770:web:7cc32bb98709bfbfb082eb',
  measurementId: 'G-YR51QZ3QHL',
};

// Initialize Firebase only if there isn't an instance already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [groups, setGroups] = useState([
    {id: 'Group1', name: 'Group 1'},
    {id: 'Group2', name: 'Group 2'},
  ]); // Example groups

  useEffect(() => {
    if (selectedGroupId) {
      const messagesQuery = query(
        collection(db, `groups/${selectedGroupId}/messages`),
        orderBy('timestamp', 'desc'),
      );
      const unsubscribe = onSnapshot(messagesQuery, querySnapshot => {
        const fetchedMessages = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const timestamp = data.timestamp
            ? new Date(data.timestamp.seconds * 1000)
            : new Date();
          return {
            id: doc.id,
            text: data.text,
            email: data.email, // Add email to the message object
            timestamp,
          };
        });
        setMessages(fetchedMessages);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [selectedGroupId]);

  const sendMessage = async () => {
    if (newMessage.trim() !== '' && selectedGroupId) {
      try {
        await addDoc(collection(db, `groups/${selectedGroupId}/messages`), {
          text: newMessage.trim(),
          email: 'user@example.com', // Placeholder for the user's email
          timestamp: serverTimestamp(),
        });
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedGroupId}
        onValueChange={(itemValue, itemIndex) => setSelectedGroupId(itemValue)}
        style={styles.picker}>
        {groups.map(group => (
          <Picker.Item key={group.id} label={group.name} value={group.id} />
        ))}
      </Picker>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <FlatList
          data={messages}
          renderItem={({item}) => (
            <View style={styles.messageContainer}>
              <Text style={styles.message}>{item.text}</Text>
              <Text style={styles.email}>{item.email}</Text>{' '}
              {/* Display the email */}
              <Text style={styles.timestamp}>
                {item.timestamp.toLocaleString()}
              </Text>
            </View>
          )}
          keyExtractor={item => item.id.toString()}
          inverted
        />
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={text => setNewMessage(text)}
          placeholder="Type your message here..."
          onSubmitEditing={() => sendMessage()}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => sendMessage()}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  messageContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
  },
  email: {
    fontSize: 14,
    color: 'green',
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: 'blue',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default ChatScreen;
