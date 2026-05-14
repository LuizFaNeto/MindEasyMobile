import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X, Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

/**
 * IMPORTANTE: Para que esta tela funcione, é necessário instalar a biblioteca:
 * npx expo install react-native-webview
 */

export default function CallScreen() {
  const { id, nome } = useLocalSearchParams<{ id: string, nome: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);

  // Configuração da sala do Jitsi
  const roomName = `MindEasy-Room-${id || 'general'}`;
  const jitsiUrl = `https://meet.jit.si/${roomName}#config.startWithAudioMuted=false&config.startWithVideoMuted=false&interfaceConfig.TOOLBAR_BUTTONS=["microphone","camera","closedcaptions","desktop","fullscreen","fodeviceselection","hangup","profile","chat","recording","livestreaming","etherpad","sharedvideo","settings","raisehand","videoquality","filmstrip","invite","feedback","stats","shortcuts","tileview","videobackgroundblur","download","help","mute-everyone","security"]`;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header / Top Bar */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.roomLabel}>Consulta Online com</Text>
          <Text style={styles.therapistName}>{nome || 'Profissional'}</Text>
        </View>
        <TouchableOpacity
          testID="call-close"
          onPress={() => router.back()}
          style={styles.closeBtn}
        >
          <X size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Video Area (Jitsi Meet) */}
      <View style={styles.videoArea}>
        {Platform.OS === 'web' ? (
          <iframe
            src={jitsiUrl}
            style={{ flex: 1, border: 'none', width: '100%', height: '100%' }}
            allow="camera; microphone; display-capture; autoplay; clipboard-write"
          />
        ) : (
          <WebView
            source={{ uri: jitsiUrl }}
            style={styles.webview}
            onLoadEnd={() => setLoading(false)}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            renderLoading={() => (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={styles.loadingText}>Conectando à sala...</Text>
              </View>
            )}
          />
        )}
      </View>

      {/* Custom Bottom Controls (Optional, as Jitsi has its own) */}
      {/* 
      <View style={[styles.controls, { paddingBottom: insets.bottom + 10 }]}>
         Most control is handled inside Jitsi's UI 
      </View> 
      */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E293B' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10
  },
  headerInfo: { flex: 1 },
  roomLabel: { color: '#CBD5E1', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  therapistName: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  closeBtn: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  videoArea: { flex: 1 },
  webview: { flex: 1, backgroundColor: '#000' },
  loadingOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: '#1E293B', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: { color: '#FFF', marginTop: 15, fontSize: 16 },
});
