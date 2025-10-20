import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { X, Shield, Info, Mail, ExternalLink, HelpCircle, Type, Share2, Trash2 } from "lucide-react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";
import { useTapes, TapeFont } from "./tape-context";

const getFontFamily = (font: TapeFont): string => {
  switch (font) {
    case 'handwriting':
      return Platform.select({
        ios: 'Bradley Hand',
        android: 'cursive',
        default: 'cursive'
      }) || 'cursive';
    case 'monospace':
      return Platform.select({
        ios: 'Courier New',
        android: 'monospace',
        default: 'monospace'
      }) || 'monospace';
    case 'serif':
      return Platform.select({
        ios: 'Georgia',
        android: 'serif',
        default: 'serif'
      }) || 'serif';
    case 'bold':
      return Platform.select({
        ios: 'System',
        android: 'sans-serif',
        default: 'System'
      }) || 'System';
    default:
      return Platform.select({
        ios: 'System',
        android: 'sans-serif',
        default: 'System'
      }) || 'System';
  }
};

export default function Settings() {
  const { tapeLabelSettings, updateTapeLabelFont, tapes, deleteTape } = useTapes();
  
  const handleClose = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };
  
  const handleShareInstructions = async () => {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    Alert.alert(
      "How to Share a Mixed Tape",
      "To give someone a mixed tape:\n\n" +
      "1. Create your tape with a special message\n" +
      "2. Add a playlist URL (Spotify, Apple Music, etc.)\n" +
      "3. Take a screenshot of your tape\n" +
      "4. Share the screenshot along with the playlist link\n\n" +
      "The recipient can see your custom design and message, then listen to your curated playlist!"
    );
  };

  const handlePrivacyPolicy = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/privacy-policy' as any);
  };

  const handleContact = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await WebBrowser.openBrowserAsync('mailto:sarah@oldskoolapps.com');
  };

  const handleWebsite = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await WebBrowser.openBrowserAsync('https://www.oldskoolapps.com');
  };

  const handleDeleteAllTapes = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const userTapesCount = tapes.length;
    
    if (userTapesCount === 0) {
      Alert.alert(
        "No Tapes",
        "You don't have any tapes to delete. Create tapes first."
      );
      return;
    }
    
    Alert.alert(
      "Delete All Tapes?",
      `This will permanently delete all ${userTapesCount} tape${userTapesCount !== 1 ? 's' : ''} from your collection. This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {
            if (Platform.OS !== "web") {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
          }
        },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            if (Platform.OS !== "web") {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
            
            const tapeIds = tapes.map(t => t.id);
            for (const id of tapeIds) {
              await deleteTape(id);
            }
            
            Alert.alert(
              "Tapes Deleted",
              "All tapes have been removed.",
              [{
                text: "OK",
                onPress: () => {
                  if (Platform.OS !== "web") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                }
              }]
            );
          }
        }
      ]
    );
  };

  return (
    <LinearGradient
      colors={["#2C1810", "#4A2C1A", "#2C1810"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            activeOpacity={0.8}
          >
            <X size={24} color="#F5E6D3" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sharing Mixed Tapes</Text>
            
            <View style={styles.instructionsCard}>
              <View style={styles.instructionItem}>
                <Share2 size={18} color="#F5E6D3" />
                <View style={styles.instructionText}>
                  <Text style={styles.instructionTitle}>Create Your Tape</Text>
                  <Text style={styles.instructionDescription}>Design a custom mixed tape with your choice of colors, fonts, and a personal message that captures your musical moment.</Text>
                </View>
              </View>
              
              <View style={styles.instructionItem}>
                <Share2 size={18} color="#F5E6D3" />
                <View style={styles.instructionText}>
                  <Text style={styles.instructionTitle}>Add Your Playlist</Text>
                  <Text style={styles.instructionDescription}>Include a playlist URL from Spotify, Apple Music, YouTube Music, or any streaming service. Add your playlists, podcasts, or any audio worth saving on a cassette.</Text>
                </View>
              </View>
              
              <View style={styles.instructionItem}>
                <Share2 size={18} color="#F5E6D3" />
                <View style={styles.instructionText}>
                  <Text style={styles.instructionTitle}>Take a Screenshot</Text>
                  <Text style={styles.instructionDescription}>Select your tape from the player to view it, then take a screenshot of the beautiful cassette design with your message.</Text>
                </View>
              </View>
              
              <View style={styles.instructionItem}>
                <Share2 size={18} color="#F5E6D3" />
                <View style={styles.instructionText}>
                  <Text style={styles.instructionTitle}>Share the Love</Text>
                  <Text style={styles.instructionDescription}>Share your playlist link and the screenshot because actual cassettes are so 1985</Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleShareInstructions}
              activeOpacity={0.8}
            >
              <View style={styles.menuItemContent}>
                <HelpCircle size={20} color="#F5E6D3" />
                <Text style={styles.menuItemText}>View Sharing Guide</Text>
              </View>
              <ExternalLink size={16} color="#999" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What Is This?</Text>
            
            <View style={styles.instructionsCard}>
              <View style={styles.instructionItem}>
                <Info size={18} color="#F5E6D3" />
                <View style={styles.instructionText}>
                  <Text style={styles.instructionDescription}>This is not a new Walkman and not a portable music player. It&apos;s a simulated cassette playing experience.</Text>
                </View>
              </View>
              
              <View style={styles.instructionItem}>
                <Info size={18} color="#F5E6D3" />
                <View style={styles.instructionText}>
                  <Text style={styles.instructionDescription}>They wrap cars in advertising—this is a cassette &quot;wrap&quot; for your mixtapes that through technology have become &quot;playlists.&quot;</Text>
                </View>
              </View>
              
              <View style={styles.instructionItem}>
                <Info size={18} color="#F5E6D3" />
                <View style={styles.instructionText}>
                  <Text style={styles.instructionDescription}>Welcome back to 1985. Enjoy.</Text>
                </View>
              </View>
              
              <View style={styles.instructionItem}>
                <Info size={18} color="#F5E6D3" />
                <View style={styles.instructionText}>
                  <Text style={styles.instructionTitle}>Horizontal View</Text>
                  <Text style={styles.instructionDescription}>Turn your device horizontal and the cassette and background enlarge, and keeps &quot;playing&quot; — enjoy the mesmerizing view.</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How to Use</Text>
            
            <View style={styles.instructionsCard}>
              <View style={styles.instructionItem}>
                <HelpCircle size={18} color="#F5E6D3" />
                <View style={styles.instructionText}>
                  <Text style={styles.instructionTitle}>Creating Tapes</Text>
                  <Text style={styles.instructionDescription}>Tap the + button to create a new mixed tape. Choose from different cassette colors and styles, add a personal message, and share your favorite playlist. Make each tape uniquely yours!</Text>
                </View>
              </View>
              
              <View style={styles.instructionItem}>
                <HelpCircle size={18} color="#F5E6D3" />
                <View style={styles.instructionText}>
                  <Text style={styles.instructionTitle}>Tape Library</Text>
                  <Text style={styles.instructionDescription}>Build your collection of up to 50 custom mixed tapes. Each tape can have its own unique design, message, and playlist link.</Text>
                </View>
              </View>
              
              <View style={styles.instructionItem}>
                <HelpCircle size={18} color="#F5E6D3" />
                <View style={styles.instructionText}>
                  <Text style={styles.instructionTitle}>Player Controls</Text>
                  <Text style={styles.instructionDescription}>The retro cassette player brings your tapes to life with animated reels. Select a tape from your stack to see it displayed in the player.</Text>
                </View>
              </View>
              
              <View style={styles.instructionItem}>
                <HelpCircle size={18} color="#F5E6D3" />
                <View style={styles.instructionText}>
                  <Text style={styles.instructionTitle}>Customization</Text>
                  <Text style={styles.instructionDescription}>Personalize your tapes with different fonts, colors, and messages. Choose from handwriting, monospace, serif, and more font styles to match your vibe.</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Default Font Style</Text>
            
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Type size={20} color="#F5E6D3" />
                <Text style={styles.cardTitle}>Choose Default Font</Text>
              </View>
              
              <Text style={styles.cardDescription}>
                This will be the default font when creating new tapes. You can change it for each individual tape.
              </Text>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled>
                <View style={styles.fontOptions}>
                  {(['default', 'handwriting', 'monospace', 'serif', 'bold'] as TapeFont[]).map((font) => (
                    <TouchableOpacity
                      key={font}
                    style={[
                      styles.fontOption,
                      tapeLabelSettings.font === font && styles.fontOptionSelected
                    ]}
                    onPress={() => {
                      if (Platform.OS !== "web") {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }
                      updateTapeLabelFont(font);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.fontOptionText,
                      { fontFamily: getFontFamily(font) },
                      tapeLabelSettings.font === font && styles.fontOptionTextSelected
                    ]}>
                      {font.charAt(0).toUpperCase() + font.slice(1)}
                    </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Information</Text>
            
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Info size={20} color="#F5E6D3" />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Version</Text>
                  <Text style={styles.infoValue}>1.0</Text>
                </View>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Info size={20} color="#F5E6D3" />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>App Name</Text>
                  <Text style={styles.infoValue}>Air Cassette &apos;85</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Legal & Privacy</Text>
            
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handlePrivacyPolicy}
              activeOpacity={0.8}
            >
              <View style={styles.menuItemContent}>
                <Shield size={20} color="#F5E6D3" />
                <Text style={styles.menuItemText}>Privacy Policy</Text>
              </View>
              <ExternalLink size={16} color="#999" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleContact}
              activeOpacity={0.8}
            >
              <View style={styles.menuItemContent}>
                <Mail size={20} color="#F5E6D3" />
                <Text style={styles.menuItemText}>Contact Support</Text>
              </View>
              <ExternalLink size={16} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleWebsite}
              activeOpacity={0.8}
            >
              <View style={styles.menuItemContent}>
                <ExternalLink size={20} color="#F5E6D3" />
                <Text style={styles.menuItemText}>Visit Website</Text>
              </View>
              <ExternalLink size={16} color="#999" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.dangerZoneTitle}>Danger Zone</Text>
            
            <TouchableOpacity
              style={styles.dangerButton}
              onPress={handleDeleteAllTapes}
              activeOpacity={0.8}
            >
              <View style={styles.menuItemContent}>
                <Trash2 size={20} color="#FF3B30" />
                <View style={styles.dangerButtonTextContainer}>
                  <Text style={styles.dangerButtonText}>Delete All Tapes</Text>
                  <Text style={styles.dangerButtonSubtext}>
                    Permanently remove all {tapes.length} tape{tapes.length !== 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>OLD SKOOL APPS</Text>
            <Text style={styles.footerSubtext}>© 2025 All rights reserved</Text>
            <Text style={styles.footerTagline}>Air Cassette &apos;85, &quot;Play&quot; Mixtapes of Your Playlists</Text>
          </View>
        </ScrollView>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(245, 230, 211, 0.2)",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold" as const,
    color: "#F5E6D3",
    letterSpacing: 1,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(245, 230, 211, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#F5E6D3",
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  infoCard: {
    backgroundColor: "rgba(245, 230, 211, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(245, 230, 211, 0.2)",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#CCC",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: "#F5E6D3",
    fontWeight: "500" as const,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(245, 230, 211, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(245, 230, 211, 0.2)",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: "#F5E6D3",
    marginLeft: 12,
    fontWeight: "500" as const,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 40,
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: "#F5E6D3",
    letterSpacing: 2,
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 12,
    color: "#CCC",
  },
  footerTagline: {
    fontSize: 12,
    color: "#CCC",
    marginTop: 8,
    fontStyle: "italic" as const,
  },
  card: {
    backgroundColor: "rgba(245, 230, 211, 0.1)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(245, 230, 211, 0.2)",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    color: "#F5E6D3",
    fontWeight: "600" as const,
    marginLeft: 12,
  },
  fontOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  fontOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderWidth: 2,
    borderColor: "rgba(245, 230, 211, 0.2)",
  },
  fontOptionSelected: {
    backgroundColor: "rgba(245, 230, 211, 0.2)",
    borderColor: "#F5E6D3",
  },
  fontOptionText: {
    fontSize: 14,
    color: "#E8E8E8",
  },
  fontOptionTextSelected: {
    color: "#F5E6D3",
    fontWeight: "600" as const,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(245, 230, 211, 0.2)",
    marginVertical: 16,
  },
  textInputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: "#F5E6D3",
    marginBottom: 8,
    fontWeight: "500" as const,
  },
  textInput: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: "#F5E6D3",
    borderWidth: 1,
    borderColor: "rgba(245, 230, 211, 0.2)",
  },
  cardDescription: {
    fontSize: 13,
    color: "#E8E8E8",
    marginBottom: 16,
    lineHeight: 18,
  },
  instructionsCard: {
    backgroundColor: "rgba(245, 230, 211, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(245, 230, 211, 0.2)",
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  instructionText: {
    marginLeft: 12,
    flex: 1,
  },
  instructionTitle: {
    fontSize: 16,
    color: "#F5E6D3",
    fontWeight: "600" as const,
    marginBottom: 4,
  },
  instructionDescription: {
    fontSize: 14,
    color: "#E8E8E8",
    lineHeight: 20,
  },
  dangerZoneTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#FF3B30",
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  dangerButton: {
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 59, 48, 0.3)",
  },
  dangerButtonTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  dangerButtonText: {
    fontSize: 16,
    color: "#FF3B30",
    fontWeight: "600" as const,
    marginBottom: 4,
  },
  dangerButtonSubtext: {
    fontSize: 13,
    color: "#E8E8E8",
  },

});