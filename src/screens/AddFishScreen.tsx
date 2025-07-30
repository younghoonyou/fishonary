import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList, Fish} from 'types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNFS from 'react-native-fs';
import {createFish, getDatabase} from 'services/db';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {useAuth} from 'context/AuthContext';
import {useToast} from 'context/ToastAlertContext';
import {useTranslation} from 'react-i18next';

type AddFishScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'AddFish'>;
  route: RouteProp<RootStackParamList, 'AddFish'>;
};
const fishTypes: string[] = (process.env.FISH_LIST?.split('|') ?? []).concat(
  'Others',
);

const AddFishScreen = ({navigation, route}: AddFishScreenProps) => {
  const {showAlert} = useToast();
  const {t} = useTranslation();
  const {user, setUpdatedUser} = useAuth();
  const {photo, location} = route.params;
  const [selectedType, setSelectedType] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [date, setDate] = useState<string>(
    new Date().getFullYear() +
      '-' +
      String(new Date().getMonth() + 1).padStart(2, '0') +
      '-' +
      String(new Date().getDate()).padStart(2, '0'),
  );

  const handleSave = async () => {
    if (!selectedType) {
      showAlert({
        type: 'error',
        message: t('Fish_type_Error'),
      });
      // Alert.alert('Error', 'Please select fish type');
      return;
    }

    const base64Photo = await RNFS.readFile(photo, 'base64');
    const db: SQLiteDatabase = await getDatabase();
    const createdFish: Fish | null = await createFish(
      db,
      name,
      selectedType,
      base64Photo,
      location,
      date,
      Number(user?.id),
      notes,
    );
    if (user) {
      setUpdatedUser({
        ...user,
        fish: user?.fish.length ? [...user?.fish, createdFish] : [createdFish],
      });
    }

    showAlert({
      type: 'success',
      message: t('Add_Fish_msg'),
    });
    navigation.navigate('Main');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons
              name="chevron-back"
              size={30}
              color="white"
              style={styles.chevronBack}
            />
          </TouchableOpacity>
          <Text style={styles.title}>{t('Add New Fish')}</Text>
        </View>

        <View style={styles.photoContainer}>
          <Image
            source={{
              uri: photo,
            }}
            style={styles.fishPhoto}
            resizeMode="contain"
          />
        </View>
        <View style={styles.formContainer}>
          {/* <KeyboardAvoidingView
        style={styles.formContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}> */}
          <Text style={styles.label}>{t('Fish Type')}</Text>
          <View style={styles.typeContainer}>
            {fishTypes.map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  selectedType === type && styles.selectedType,
                ]}
                onPress={() => setSelectedType(type)}>
                <Text
                  style={[
                    styles.typeText,
                    selectedType === type && styles.selectedTypeText,
                  ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>{t('Name')}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t('Add_Fish_name_placeholder')}
            placeholderTextColor="gray"
            value={name}
            onChangeText={setName}
            numberOfLines={4}
          />

          <Text style={styles.label}>{t('Location')}</Text>
          <Text style={styles.input}>{location.name}</Text>

          <Text style={styles.label}>{t('Date')}</Text>
          <Text style={styles.input}>{date}</Text>

          <Text style={styles.label}>{t('Notes')}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t('Add_Fish_note_placeholder')}
            placeholderTextColor="gray"
            value={notes}
            onChangeText={setNotes}
            // multiline
            numberOfLines={4}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>{t('Save Fish')}</Text>
          </TouchableOpacity>
        </View>
        {/* </KeyboardAvoidingView> */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#7eb9cd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  photoContainer: {
    width: '100%',
    height: 350,
    backgroundColor: 'black',
  },
  fishPhoto: {
    width: '100%',
    height: '100%',
  },
  formContainer: {
    padding: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 50,
    textAlignVertical: 'top',
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  typeButton: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedType: {
    backgroundColor: '#0077c2',
    borderColor: '#0077c2',
  },
  typeText: {
    fontSize: 14,
  },
  selectedTypeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#7eb9cd',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  chevronBack: {
    marginRight: 15,
  },
});

export default React.memo(AddFishScreen);
