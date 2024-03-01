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
  const [username, setUsername] = useState('');

  useEffect(() => {
    const messagesQuery = query(
      collection(db, 'messages'),
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
          username: data.username,
          timestamp,
        };
      });
      setMessages(fetchedMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (newMessage.trim() !== '') {
      try {
        await addDoc(collection(db, 'messages'), {
          text: newMessage.trim(),
          username: username || 'Anonymous', // Use username if provided, else 'Anonymous'
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
      <TextInput
        style={styles.usernameInput}
        value={username}
        onChangeText={text => setUsername(text)}
        placeholder="Enter your username"
      />
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <FlatList
          data={messages}
          renderItem={({item}) => (
            <View style={styles.messageContainer}>
              <Text style={styles.username}>{item.username}</Text>
              <Text style={styles.message}>{item.text}</Text>
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
  username: {
    fontSize: 14,
    color: 'green',
    marginBottom: 5,
  },
  message: {
    fontSize: 16,
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
  usernameInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
});

export default ChatScreen;
