import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Modal,
  Platform,
  Alert,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft,
  Plus,
  Trash2,
  Check,
  X,
  Edit3,
  Save,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useTapes, TAPE_STYLES, TapeFont } from './tape-context';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CASSETTE_WIDTH = SCREEN_WIDTH * 0.85;
const CASSETTE_HEIGHT = CASSETTE_WIDTH * 0.62;

const getFontFamily = (font: TapeFont): string => {
  switch (font) {
    case 'handwriting':
    case 'handwriting-bold':
      return Platform.select({
        ios: 'Bradley Hand',
        android: 'cursive',
        default: 'cursive'
      }) || 'cursive';
    case 'monospace':
    case 'monospace-bold':
      return Platform.select({
        ios: 'Courier New',
        android: 'monospace',
        default: 'monospace'
      }) || 'monospace';
    case 'serif':
    case 'serif-bold':
      return Platform.select({
        ios: 'Georgia',
        android: 'serif',
        default: 'serif'
      }) || 'serif';
    case 'bold':
      return Platform.select({
        ios: 'System',
        android: 'sans-serif-medium',
        default: 'System'
      }) || 'System';
    case 'sharpie':
    case 'sharpie-bold':
      return Platform.select({
        ios: 'Snell Roundhand',
        android: 'casual',
        web: 'Caveat, cursive',
        default: 'cursive'
      }) || 'cursive';
    case 'default-bold':
    default:
      return Platform.select({
        ios: 'System',
        android: 'sans-serif',
        default: 'System'
      }) || 'System';
  }
};

export default function MixedTapesScreen() {
  const { tapes, createTape, updateTape, deleteTape, selectTape, getTapeStyle } = useTapes();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tapeToDelete, setTapeToDelete] = useState<string | null>(null);
  const [tapeToEdit, setTapeToEdit] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [newTapeName, setNewTapeName] = useState('');
  const [newTapeDescription, setNewTapeDescription] = useState('');
  const [selectedStyleId, setSelectedStyleId] = useState(TAPE_STYLES[0].id);
  const [selectedFont, setSelectedFont] = useState<TapeFont>('handwriting');
  const [newTapePlaylistUrl, setNewTapePlaylistUrl] = useState('');
  
  const [editTapeName, setEditTapeName] = useState('');
  const [editTapeDescription, setEditTapeDescription] = useState('');
  const [editStyleId, setEditStyleId] = useState(TAPE_STYLES[0].id);
  const [editFont, setEditFont] = useState<TapeFont>('handwriting');
  const [editTapePlaylistUrl, setEditTapePlaylistUrl] = useState('');

  const handleCreateTape = async () => {
    if (isCreating) return;
    
    if (!newTapeName.trim()) {
      Alert.alert('Error', 'Please enter a tape name');
      return;
    }

    setIsCreating(true);
    
    try {
      await createTape(
        newTapeName.trim(),
        '',
        newTapeDescription.trim(),
        selectedStyleId,
        selectedFont,
        newTapePlaylistUrl.trim() || undefined
      );
      
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      setNewTapeName('');
      setNewTapeDescription('');
      setNewTapePlaylistUrl('');
      setSelectedStyleId(TAPE_STYLES[0].id);
      setSelectedFont('handwriting');
      setShowCreateModal(false);
      
      Alert.alert('Success', 'Your mixed tape has been created!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create tape');
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditTape = (tapeId: string) => {
    const tape = tapes.find(t => t.id === tapeId);
    if (tape) {
      setTapeToEdit(tapeId);
      setEditTapeName(tape.name);
      setEditTapeDescription(tape.description);
      setEditStyleId(tape.styleId);
      setEditFont(tape.font);
      setEditTapePlaylistUrl(tape.playlistUrl || '');
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = async () => {
    if (isSaving || !tapeToEdit) return;
    
    if (!editTapeName.trim()) {
      Alert.alert('Error', 'Please enter a tape name');
      return;
    }

    setIsSaving(true);
    
    try {
      await updateTape(tapeToEdit, {
        name: editTapeName.trim(),
        to: '',
        description: editTapeDescription.trim(),
        styleId: editStyleId,
        font: editFont,
        playlistUrl: editTapePlaylistUrl.trim() || undefined,
      });
      
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      setShowEditModal(false);
      setTapeToEdit(null);
      
      Alert.alert('Success', 'Your tape has been updated!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update tape');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTape = (tapeId: string) => {
    setTapeToDelete(tapeId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (tapeToDelete) {
      await deleteTape(tapeToDelete);
      setShowDeleteModal(false);
      setTapeToDelete(null);
      
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };

  const handleSelectTape = (tapeId: string) => {
    if (editMode) {
      return;
    }
    selectTape(tapeId);
    router.back();
  };

  const toggleEditMode = async () => {
    setEditMode(!editMode);
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <ArrowLeft size={24} color="#00d4ff" />
          </TouchableOpacity>
          <Text style={styles.title}>MY TAPE STACK</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowCreateModal(true)}
            activeOpacity={0.8}
            disabled={tapes.length >= 50}
          >
            <Plus size={24} color={tapes.length >= 50 ? "#666" : "#00d4ff"} />
          </TouchableOpacity>
        </View>

        {tapes.length > 0 && (
          <View style={styles.editStackButtonContainer}>
            <TouchableOpacity
              style={styles.editStackButton}
              onPress={toggleEditMode}
              activeOpacity={0.8}
            >
              {editMode ? (
                <>
                  <Save size={18} color="#fff" />
                  <Text style={styles.editStackButtonText}>Done</Text>
                </>
              ) : (
                <>
                  <Edit3 size={18} color="#fff" />
                  <Text style={styles.editStackButtonText}>Edit Stack</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.subtitle}>
          {tapes.length}/50 Tapes
        </Text>

        {tapes.length > 0 && !editMode && (
          <View style={styles.tapToPlayContainer}>
            <TouchableOpacity
              style={styles.globalPlayButton}
              onPress={() => {
                if (tapes.length > 0) {
                  selectTape(tapes[0].id);
                  router.back();
                }
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.globalPlayIcon}>▶</Text>
            </TouchableOpacity>
            <Text style={styles.tapToPlayHint}>
              Tap any cassette to play
            </Text>
          </View>
        )}

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {tapes.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No Mixed Tapes Yet</Text>
              <Text style={styles.emptySubtitle}>
                Create your first mixed tape with a custom design and message
              </Text>
              <TouchableOpacity
                style={styles.createFirstButton}
                onPress={() => setShowCreateModal(true)}
                activeOpacity={0.8}
              >
                <Plus size={20} color="#fff" />
                <Text style={styles.createFirstButtonText}>Create Your First Tape</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {tapes.map((tape) => {
                const style = getTapeStyle(tape.styleId);
                return (
                  <TouchableOpacity
                    key={tape.id}
                    style={[styles.tapeCard, editMode && styles.tapeCardEditMode]}
                    onPress={() => handleSelectTape(tape.id)}
                    activeOpacity={editMode ? 1 : 0.8}
                  >
                    <LinearGradient
                      colors={style.cassetteBody as [string, string, ...string[]]}
                      style={styles.cassetteWrapper}
                    >
                      <View style={styles.cassetteLabelArea}>
                        <View style={[styles.cassetteLabelStripe, { backgroundColor: style.labelStripe }]} />
                        
                        <View style={styles.cassetteSideLabelBox}>
                          <Text style={styles.cassetteSideLabelBoxText}>A</Text>
                        </View>
                        <View style={styles.cassetteLabelContent}>
                          <Text
                            style={[
                              styles.cassetteLabelTitle,
                              { fontFamily: getFontFamily(tape.font) },
                              (tape.font === 'bold' || tape.font.endsWith('-bold')) && { fontWeight: '700' as const }
                            ]}
                            numberOfLines={1}
                          >
                            {tape.name}
                          </Text>
                          {tape.description && (
                            <Text style={styles.cassetteLabelDescription} numberOfLines={2}>
                              {tape.description}
                            </Text>
                          )}
                        </View>
                        
                        <View style={[styles.cassetteLabelStripe, { backgroundColor: style.labelStripe }]} />
                      </View>

                      <View style={styles.cassetteTapeWindow}>
                        <View style={styles.cassetteReel}>
                          <View style={[styles.cassetteReelCenter, { backgroundColor: style.reelColor }]} />
                        </View>
                        <View style={styles.cassetteTapeStrip} />
                        <View style={styles.cassetteReel}>
                          <View style={[styles.cassetteReelCenter, { backgroundColor: style.reelColor }]} />
                        </View>
                      </View>

                      <View style={styles.cassetteBottom}>
                        <View style={styles.cassetteScrew} />
                        <View style={[styles.cassetteTypeIndicator, { backgroundColor: style.labelStripe }]}>
                          <Text style={styles.cassetteTypeText}>TYPE II</Text>
                        </View>
                        <View style={styles.cassetteScrew} />
                      </View>

                      {editMode && (
                        <>
                          <TouchableOpacity
                            style={styles.cassetteEditButton}
                            onPress={(e) => {
                              e.stopPropagation();
                              handleEditTape(tape.id);
                            }}
                            activeOpacity={0.8}
                          >
                            <Edit3 size={20} color="#fff" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.cassetteDeleteButton}
                            onPress={(e) => {
                              e.stopPropagation();
                              handleDeleteTape(tape.id);
                            }}
                            activeOpacity={0.8}
                          >
                            <Trash2 size={20} color="#fff" />
                          </TouchableOpacity>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </>
          )}
        </ScrollView>

        <Modal
          visible={showCreateModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowCreateModal(false)}
        >
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalKeyboardView}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
              <View style={styles.modalContent}>
                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.modalScrollContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Create Mixed Tape</Text>
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => setShowCreateModal(false)}
                    activeOpacity={0.8}
                  >
                    <X size={24} color="#fff" />
                  </TouchableOpacity>
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.inputLabel}>Tape Name *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={newTapeName}
                    onChangeText={setNewTapeName}
                    placeholder="My Mix '85"
                    placeholderTextColor="#666"
                    maxLength={30}
                  />
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.inputLabel}>Description</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    value={newTapeDescription}
                    onChangeText={setNewTapeDescription}
                    placeholder="What's on this tape?"
                    placeholderTextColor="#666"
                    multiline
                    numberOfLines={3}
                    maxLength={100}
                  />
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.inputLabel}>Playlist URL (Optional)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={newTapePlaylistUrl}
                    onChangeText={setNewTapePlaylistUrl}
                    placeholder="https://spotify.com/playlist/..."
                    placeholderTextColor="#666"
                    autoCapitalize="none"
                    keyboardType="url"
                  />
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.inputLabel}>Font Style</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled>
                    <View style={styles.fontOptions}>
                      {(['sharpie', 'sharpie-bold', 'handwriting', 'handwriting-bold', 'default', 'default-bold', 'monospace', 'monospace-bold', 'serif', 'serif-bold', 'bold'] as TapeFont[]).map((font) => (
                        <TouchableOpacity
                          key={font}
                          style={[
                            styles.fontOption,
                            selectedFont === font && styles.fontOptionSelected
                          ]}
                          onPress={() => setSelectedFont(font)}
                          activeOpacity={0.8}
                        >
                          <Text style={[
                            styles.fontOptionText,
                            { fontFamily: getFontFamily(font) },
                            font.endsWith('-bold') && { fontWeight: '700' as const },
                            font === 'bold' && { fontWeight: '700' as const }
                          ]}>
                            {font === 'default' ? 'Default' : font === 'default-bold' ? 'Default Bold' : font === 'handwriting-bold' ? 'Handwriting Bold' : font === 'monospace-bold' ? 'Monospace Bold' : font === 'serif-bold' ? 'Serif Bold' : font === 'sharpie-bold' ? 'Sharpie Bold' : font.charAt(0).toUpperCase() + font.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.inputLabel}>Tape Color Style</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled>
                    <View style={styles.styleOptions}>
                      {TAPE_STYLES.map((style) => (
                        <TouchableOpacity
                          key={style.id}
                          style={[
                            styles.styleOption,
                            selectedStyleId === style.id && styles.styleOptionSelected
                          ]}
                          onPress={() => setSelectedStyleId(style.id)}
                          activeOpacity={0.8}
                        >
                          <LinearGradient
                            colors={style.cassetteBody as [string, string, ...string[]]}
                            style={styles.stylePreview}
                          >
                            <View style={[styles.styleStripe, { backgroundColor: style.labelStripe }]} />
                          </LinearGradient>
                          <Text style={styles.styleName}>{style.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                <TouchableOpacity
                  style={[styles.createButton, isCreating && styles.createButtonDisabled]}
                  onPress={handleCreateTape}
                  activeOpacity={0.8}
                  disabled={isCreating}
                >
                  <Check size={20} color="#fff" />
                  <Text style={styles.createButtonText}>Create Tape</Text>
                </TouchableOpacity>
                </ScrollView>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>

        <Modal
          visible={showEditModal}
          transparent
          animationType="slide"
          onRequestClose={() => {
            setShowEditModal(false);
            setTapeToEdit(null);
          }}
        >
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalKeyboardView}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
              <View style={styles.modalContent}>
                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.modalScrollContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Edit Tape</Text>
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => {
                      setShowEditModal(false);
                      setTapeToEdit(null);
                    }}
                    activeOpacity={0.8}
                  >
                    <X size={24} color="#fff" />
                  </TouchableOpacity>
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.inputLabel}>Tape Name *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editTapeName}
                    onChangeText={setEditTapeName}
                    placeholder="My Mix '85"
                    placeholderTextColor="#666"
                    maxLength={30}
                  />
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.inputLabel}>Description</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    value={editTapeDescription}
                    onChangeText={setEditTapeDescription}
                    placeholder="What's on this tape?"
                    placeholderTextColor="#666"
                    multiline
                    numberOfLines={3}
                    maxLength={100}
                  />
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.inputLabel}>Playlist URL (Optional)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editTapePlaylistUrl}
                    onChangeText={setEditTapePlaylistUrl}
                    placeholder="https://spotify.com/playlist/..."
                    placeholderTextColor="#666"
                    autoCapitalize="none"
                    keyboardType="url"
                  />
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.inputLabel}>Font Style</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled>
                    <View style={styles.fontOptions}>
                      {(['sharpie', 'sharpie-bold', 'handwriting', 'handwriting-bold', 'default', 'default-bold', 'monospace', 'monospace-bold', 'serif', 'serif-bold', 'bold'] as TapeFont[]).map((font) => (
                        <TouchableOpacity
                          key={font}
                          style={[
                            styles.fontOption,
                            editFont === font && styles.fontOptionSelected
                          ]}
                          onPress={() => setEditFont(font)}
                          activeOpacity={0.8}
                        >
                          <Text style={[
                            styles.fontOptionText,
                            { fontFamily: getFontFamily(font) },
                            font.endsWith('-bold') && { fontWeight: '700' as const },
                            font === 'bold' && { fontWeight: '700' as const }
                          ]}>
                            {font === 'default' ? 'Default' : font === 'default-bold' ? 'Default Bold' : font === 'handwriting-bold' ? 'Handwriting Bold' : font === 'monospace-bold' ? 'Monospace Bold' : font === 'serif-bold' ? 'Serif Bold' : font === 'sharpie-bold' ? 'Sharpie Bold' : font.charAt(0).toUpperCase() + font.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.inputLabel}>Tape Color Style</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled>
                    <View style={styles.styleOptions}>
                      {TAPE_STYLES.map((style) => (
                        <TouchableOpacity
                          key={style.id}
                          style={[
                            styles.styleOption,
                            editStyleId === style.id && styles.styleOptionSelected
                          ]}
                          onPress={() => setEditStyleId(style.id)}
                          activeOpacity={0.8}
                        >
                          <LinearGradient
                            colors={style.cassetteBody as [string, string, ...string[]]}
                            style={styles.stylePreview}
                          >
                            <View style={[styles.styleStripe, { backgroundColor: style.labelStripe }]} />
                          </LinearGradient>
                          <Text style={styles.styleName}>{style.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                <TouchableOpacity
                  style={[styles.createButton, isSaving && styles.createButtonDisabled]}
                  onPress={handleSaveEdit}
                  activeOpacity={0.8}
                  disabled={isSaving}
                >
                  <Check size={20} color="#fff" />
                  <Text style={styles.createButtonText}>Save Changes</Text>
                </TouchableOpacity>
                </ScrollView>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>

        <Modal
          visible={showDeleteModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDeleteModal(false)}
        >
          <View style={styles.deleteModalOverlay}>
            <View style={styles.deleteModalContent}>
              <Text style={styles.deleteModalTitle}>Delete Tape?</Text>
              <Text style={styles.deleteModalMessage}>
                This action cannot be undone.
              </Text>
              
              <View style={styles.deleteModalActions}>
                <TouchableOpacity
                  style={[styles.modalActionButton, styles.cancelButton]}
                  onPress={() => setShowDeleteModal(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalActionButton, styles.confirmDeleteButton]}
                  onPress={confirmDelete}
                  activeOpacity={0.8}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00d4ff',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00d4ff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#00d4ff',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 5,
  },
  tapToPlayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 15,
  },
  globalPlayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 212, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 5,
  },
  globalPlayIcon: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 2,
  },
  tapToPlayHint: {
    fontSize: 12,
    color: '#00d4ff',
    fontStyle: 'italic' as const,
    opacity: 0.8,
  },
  editStackButtonContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  editStackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00d4ff',
    gap: 8,
  },
  editStackButtonText: {
    fontSize: 14,
    fontWeight: 'bold' as const,
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#fff',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 40,
  },
  createFirstButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  createFirstButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
  tapeCard: {
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  tapeCardEditMode: {
    opacity: 0.9,
  },
  cassetteWrapper: {
    padding: 15,
    height: CASSETTE_HEIGHT,
    position: 'relative',
  },

  cassetteLabelArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    padding: 10,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 10,
    position: 'relative' as const,
  },
  cassetteSideLabelBox: {
    position: 'absolute' as const,
    left: 4,
    top: 10,
    width: 18,
    height: 18,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  cassetteSideLabelBoxText: {
    fontSize: 13,
    fontWeight: 'bold' as const,
    color: '#fff',
  },
  cassetteLabelStripe: {
    height: 4,
    marginVertical: 3,
  },
  cassetteLabelContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cassetteLabelTitle: {
    fontSize: 13,
    fontWeight: 'bold' as const,
    color: '#000000',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 3,
    paddingHorizontal: 4,
  },
  cassetteToFromRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 1,
    marginBottom: 3,
    paddingHorizontal: 4,
    paddingLeft: 26,
  },
  cassetteToFromText: {
    fontSize: 10,
    color: '#000000',
    fontWeight: '600' as const,
  },
  cassetteLabelDescription: {
    fontSize: 11,
    color: '#000000',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 2,
    paddingHorizontal: 4,
    lineHeight: 14,
  },
  cassetteTapeWindow: {
    flexDirection: 'row',
    height: CASSETTE_HEIGHT * 0.35,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 4,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cassetteReel: {
    width: CASSETTE_WIDTH * 0.22,
    height: CASSETTE_WIDTH * 0.22,
    backgroundColor: '#1A1A1A',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  cassetteReelCenter: {
    width: '30%',
    height: '30%',
    borderRadius: 100,
  },
  cassetteTapeStrip: {
    flex: 1,
    height: 20,
    backgroundColor: '#2A1810',
    marginHorizontal: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#1A0A00',
  },
  cassetteBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  cassetteScrew: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#999',
    borderWidth: 2,
    borderColor: '#666',
  },
  cassetteTypeIndicator: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 3,
  },
  cassetteTypeText: {
    fontSize: 10,
    fontWeight: 'bold' as const,
    color: '#fff',
  },
  cassetteEditButton: {
    position: 'absolute',
    top: 10,
    right: 60,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 212, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  cassetteDeleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(220, 53, 69, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalKeyboardView: {
    width: '100%',
    maxHeight: '95%',
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    maxHeight: '100%',
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#fff',
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formSection: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  formHalf: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold' as const,
    color: '#00d4ff',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  fontOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  fontOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  fontOptionSelected: {
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    borderColor: '#00d4ff',
  },
  fontOptionText: {
    fontSize: 14,
    color: '#fff',
  },
  styleOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  styleOption: {
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
  },
  styleOptionSelected: {
    borderColor: '#00d4ff',
  },
  stylePreview: {
    width: 80,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  styleStripe: {
    width: '80%',
    height: 4,
    borderRadius: 2,
  },
  styleName: {
    fontSize: 11,
    color: '#fff',
    textAlign: 'center',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
    gap: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#fff',
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  deleteModalContent: {
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    padding: 25,
    width: '100%',
    maxWidth: 350,
    borderWidth: 1,
    borderColor: '#00d4ff',
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  deleteModalMessage: {
    fontSize: 16,
    color: '#E8E8E8',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
  },
  deleteModalActions: {
    flexDirection: 'row',
    gap: 15,
  },
  modalActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#666',
  },
  confirmDeleteButton: {
    backgroundColor: '#dc3545',
  },
  cancelButtonText: {
    color: '#E8E8E8',
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
});
