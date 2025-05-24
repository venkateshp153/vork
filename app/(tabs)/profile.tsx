import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  StyleSheet, 
  Animated, 
  Easing,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import icons from '@/constants/icons';
import { authService } from '@/redux/services/authService';
import { setUser } from "../../redux/slices/authSlice";

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state:any) => state.auth.user);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editedUser, setEditedUser] = useState({
    Username: '',
    Email: '',
    Company: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(300))[0];

  useEffect(() => {
    if (currentUser) {
      setEditedUser({
        Username: currentUser.Username || '',
        Email: currentUser.Email || '',
        Company: currentUser.Company || '',
      });
    }
  }, [currentUser]);

  const animateIn = () => {
    setEditModalVisible(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateOut = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 500,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setEditModalVisible(false));
  };

  const handleSave = async () => {
    if (!currentUser?.Email) return;
    
    setIsUpdating(true);
    try {
      const updatedUser = await authService.updateUser(
        currentUser.Email, 
        {
          Username: editedUser.Username,
          Company: editedUser.Company
          // Don't update email as it's typically used as ID
        }
      );
      
      dispatch(setUser(updatedUser));
      animateOut();
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error:any) {
      console.error('Update error:', error);
      Alert.alert(
        'Update Failed', 
        error.message || 'Could not update profile'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6c5ce7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.cameraButton}>
            <Image source={icons.carPark} style={{ width: 20, height: 20, alignSelf: "center" }}  />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{currentUser.Username || 'User'}</Text>
        <Text style={styles.email}>{currentUser.Email}</Text>
      </View>

      {/* Edit Button */}
      <TouchableOpacity style={styles.editButton} onPress={animateIn}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* User Info */}
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
        <Image source={icons.carPark} style={{ width: 20, height: 20, alignSelf: "center" }}  />
          <View>
            <Text style={styles.infoLabel}>Username</Text>
            <Text style={styles.infoValue}>{currentUser.Username || 'Not set'}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
        <Image source={icons.carPark} style={{ width: 20, height: 20, alignSelf: "center" }}  />
          <View>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{currentUser.Email}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
        <Image source={icons.carPark} style={{ width: 20, height: 20, alignSelf: "center" }}  />
          <View>
            <Text style={styles.infoLabel}>Company</Text>
            <Text style={styles.infoValue}>{currentUser.Company || 'Not set'}</Text>
          </View>
        </View>
      </View>

      {/* Edit Modal */}
      <Modal
        transparent={true}
        visible={isEditModalVisible}
        animationType="none"
        onRequestClose={animateOut}
      >
        <Animated.View style={[styles.modalBackdrop, { opacity: fadeAnim }]}>
          <TouchableOpacity 
            style={styles.modalBackground} 
            activeOpacity={1} 
            onPress={animateOut}
          />
        </Animated.View>

        <Animated.View 
          style={[
            styles.modalContent, 
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Text style={styles.modalTitle}>Edit Profile</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.input}
              value={editedUser.Username}
              onChangeText={(text) => setEditedUser({...editedUser, Username: text})}
              placeholder="Enter username"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={[styles.input, { color: '#95a5a6' }]}
              value={editedUser.Email}
              editable={false}
              placeholder="Email (cannot be changed)"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Company</Text>
            <TextInput
              style={styles.input}
              value={editedUser.Company}
              onChangeText={(text) => setEditedUser({...editedUser, Company: text})}
              placeholder="Enter company name"
            />
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={animateOut}
              disabled={isUpdating}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleSave}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#6c5ce7',
  },
  cameraButton: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    backgroundColor: '#6c5ce7',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#636e72',
  },
  editButton: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 20,
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoIcon: {
    marginRight: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#636e72',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2d3436',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBackground: {
    flex: 1,
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 25,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#636e72',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f1f3f6',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#2d3436',
    borderWidth: 1,
    borderColor: '#dfe6e9',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#dfe6e9',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#636e72',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#6c5ce7',
    padding: 15,
    borderRadius: 10,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ProfileScreen;