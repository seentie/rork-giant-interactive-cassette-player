import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { X } from "lucide-react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

export default function PrivacyPolicy() {
  const handleClose = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  return (
    <LinearGradient
      colors={["#2C1810", "#4A2C1A", "#2C1810"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Privacy Policy</Text>
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
            <Text style={styles.lastUpdated}>(Last Updated: January 2025)</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.bodyText}>
              OLD SKOOL APPS (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our mobile application.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Information We Collect</Text>
            
            <Text style={styles.subTitle}>Information You Provide</Text>
            <Text style={styles.bulletPoint}>• Account information (name, email address)</Text>
            <Text style={styles.bulletPoint}>• Profile information you choose to share</Text>
            <Text style={styles.bulletPoint}>• Content you create or upload</Text>
            <Text style={styles.bulletPoint}>• Communications with us</Text>
            
            <Text style={styles.subTitle}>Information Automatically Collected</Text>
            <Text style={styles.bulletPoint}>• Device information (device type, operating system)</Text>
            <Text style={styles.bulletPoint}>• Usage data (how you interact with the app)</Text>
            <Text style={styles.bulletPoint}>• Log data (app crashes, performance metrics)</Text>
            <Text style={styles.bulletPoint}>• Location data (if you grant permission)</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How We Use Your Information</Text>
            <Text style={styles.bodyText}>We use your information to:</Text>
            <Text style={styles.bulletPoint}>• Provide and improve our app services</Text>
            <Text style={styles.bulletPoint}>• Create and maintain your account</Text>
            <Text style={styles.bulletPoint}>• Send important updates and notifications</Text>
            <Text style={styles.bulletPoint}>• Respond to your questions and support requests</Text>
            <Text style={styles.bulletPoint}>• Analyze app usage to improve user experience</Text>
            <Text style={styles.bulletPoint}>• Ensure app security and prevent fraud</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Information Sharing</Text>
            <Text style={styles.bodyText}>
              We do not sell your personal information. We may share your information only in these situations:
            </Text>
            <Text style={styles.bulletPoint}>• With your consent - When you explicitly agree</Text>
            <Text style={styles.bulletPoint}>• Service providers - Third parties who help us operate the app</Text>
            <Text style={styles.bulletPoint}>• Legal requirements - When required by law or to protect rights and safety</Text>
            <Text style={styles.bulletPoint}>• Business transfers - If our company is sold or merged</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Security</Text>
            <Text style={styles.bodyText}>
              We implement appropriate security measures to protect your information, including:
            </Text>
            <Text style={styles.bulletPoint}>• Encryption of sensitive data</Text>
            <Text style={styles.bulletPoint}>• Secure data transmission</Text>
            <Text style={styles.bulletPoint}>• Regular security assessments</Text>
            <Text style={styles.bulletPoint}>• Limited access to personal information</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Rights</Text>
            <Text style={styles.bodyText}>You have the right to:</Text>
            <Text style={styles.bulletPoint}>• Access your personal information</Text>
            <Text style={styles.bulletPoint}>• Correct inaccurate information</Text>
            <Text style={styles.bulletPoint}>• Delete your account and data</Text>
            <Text style={styles.bulletPoint}>• Opt out of marketing communications</Text>
            <Text style={styles.bulletPoint}>• Request data portability (where applicable)</Text>
            <Text style={styles.bodyText}>
              To exercise these rights, contact us at www.oldskoolapps.com
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Children&apos;s Privacy</Text>
            <Text style={styles.bodyText}>
              Our app is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we discover we have collected such information, we will delete it promptly.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Third-Party Services</Text>
            <Text style={styles.bodyText}>
              Our app may contain links to third-party services or integrate with other platforms. This privacy policy does not apply to those services. Please review their privacy policies separately.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Changes to This Policy</Text>
            <Text style={styles.bodyText}>
              We may update this Privacy Policy from time to time. We will notify you of significant changes by:
            </Text>
            <Text style={styles.bulletPoint}>• Posting the updated policy in the app</Text>
            <Text style={styles.bulletPoint}>• Sending you an email notification</Text>
            <Text style={styles.bulletPoint}>• Displaying a notice when you next open the app</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <Text style={styles.bodyText}>
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:
            </Text>
            <Text style={styles.contactInfo}>Email: sarah@oldskoolapps.com</Text>
            <Text style={styles.contactInfo}>Address: 2114 N Flamingo Road #867, Pembroke Pines, FL 33028</Text>
            <Text style={styles.contactInfo}>Phone: (646)-540-9602</Text>
            <Text style={styles.contactInfo}>App version: 1.0</Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>OLD SKOOL APPS</Text>
            <Text style={styles.footerSubtext}>© 2025 All rights reserved</Text>
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
    marginTop: 25,
  },
  lastUpdated: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic" as const,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: "#F5E6D3",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: "#F5E6D3",
    marginTop: 15,
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 15,
    color: "#E0E0E0",
    lineHeight: 22,
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 15,
    color: "#E0E0E0",
    lineHeight: 22,
    marginBottom: 6,
    paddingLeft: 10,
  },
  contactInfo: {
    fontSize: 15,
    color: "#F5E6D3",
    lineHeight: 22,
    marginBottom: 6,
    fontWeight: "500" as const,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 40,
    marginTop: 30,
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
    color: "#999",
  },
});