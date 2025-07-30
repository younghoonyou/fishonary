import React, {useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import {useAuth} from 'context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getDatabase, updateUser} from 'services/db';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {useToast} from 'context/ToastAlertContext';
import {User} from 'types';
import {useTranslation} from 'react-i18next';

const AccountScreen = ({navigation}: any) => {
  const {user, logout, login, setLoading, setUpdatedUser} = useAuth();
  const {t} = useTranslation();
  const {showAlert} = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const FisherManImage = useMemo(() => {
    return require('src/assets/fisherman.png');
  }, []);

  const handleSave = useCallback(async () => {
    try {
      setLoading(true);
      const db: SQLiteDatabase = await getDatabase();
      const updatedUser: User = await updateUser(db, username, user?.id);
      setUpdatedUser(updatedUser);
    } catch (error: any) {
      const errorMessage: string =
        error.response?.data?.message ||
        error.message ||
        'Exceptional error occurred';
      showAlert({
        message: errorMessage,
        type: 'error',
      });
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  }, [username]);

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    Alert.alert(t('Delete Account'), t('Account_alert_msg'), [
      {
        text: t('Cancel'),
        style: 'cancel',
      },
      {
        text: t('Delete'),
        style: 'destructive',
        onPress: () => {
          // TODO: Implement actual account deletion
          // Alert.alert('Account Deleted', 'Your account has been deleted.', [
          //   {
          //     text: 'OK',
          //     onPress: logout,
          //   },
          // ]);
          showAlert({
            type: 'info',
            message: t('Deleted_msg'),
          });
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('Account')}</Text>
      </View>

      <View style={styles.profileContainer}>
        <View style={styles.profileHeader}>
          <Image source={FisherManImage} style={styles.profileImage} />
          <TouchableOpacity style={styles.profileEditWrapper}>
            <Ionicons
              name="pencil"
              size={25}
              color="white"
              style={styles.profileEditButton}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>{t('Personal Information')}</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('User name')}</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  placeholder={t('Enter username')}
                  placeholderTextColor="gray"
                />
              ) : (
                <Text style={styles.value}>{username}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('Email')}</Text>
              <Text style={styles.value}>{email}</Text>
            </View>
            <View style={styles.editButtonWrap}>
              {isEditing && (
                <TouchableOpacity
                  style={{
                    ...styles.editButton,
                    width: '45%',
                    backgroundColor: '#ff3b30',
                  }}
                  onPress={handleCancel}>
                  <Text style={styles.editButtonText}>{t('Cancel')}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={{
                  ...styles.editButton,
                  width: isEditing ? '45%' : '100%',
                }}
                onPress={isEditing ? handleSave : () => setIsEditing(true)}>
                <Text style={styles.editButtonText}>
                  {isEditing ? t('Save Changes') : t('Edit Profile')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* <View style={styles.infoSection}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleDeleteAccount}>
              <Text style={styles.deleteButtonText}>Remove Ads</Text>
            </TouchableOpacity>
          </View> */}
          <View style={styles.dangerZone}>
            <Text style={styles.dangerTitle}>{t('Delete Account')}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteAccount}>
              <Text style={styles.deleteButtonText}>{t('Delete Account')}</Text>
            </TouchableOpacity>
            <Text style={styles.deleteWarning}>{t('Delete_warning_msg')}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 15,
    backgroundColor: '#7eb9cd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  backText: {
    color: 'white',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileContainer: {
    padding: 15,
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  changePhotoButton: {
    backgroundColor: '#0077c2',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changePhotoText: {
    color: 'white',
    fontSize: 14,
  },
  infoContainer: {
    gap: 20,
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  editButtonWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  input: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#0077c2',
  },
  editButton: {
    backgroundColor: '#0077c2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '33%',
    alignItems: 'center',
    marginBottom: 15,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0077c2',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  dangerZone: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ff3b30',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff3b30',
    marginBottom: 15,
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteWarning: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  profileEditWrapper: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#0077c2',
    position: 'absolute',
    left: '55%',
    bottom: '10%',
    display: 'flex',
    justifyContent: 'center',
  },
  profileEditButton: {
    display: 'flex',
    alignSelf: 'center',
    verticalAlign: 'middle',
  },
});

export default React.memo(AccountScreen);
