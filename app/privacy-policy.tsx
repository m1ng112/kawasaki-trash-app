import React from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLocalization } from '@/contexts/LocalizationContext';

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const { language } = useLocalization();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const getContent = () => {
    switch (language) {
      case 'en':
        return {
          title: 'Privacy Policy',
          lastUpdated: 'Last updated: June 12, 2025',
          sections: [
            {
              title: 'Introduction',
              content: 'The "Kawasaki City Waste Sorting App" (hereinafter "the App") respects user privacy and is committed to protecting personal information. This privacy policy clearly explains what information we collect, how we use it, and how we protect it.'
            },
            {
              title: 'Information We Collect and Purpose',
              content: 'The App may collect the following information. All data collection occurs only with explicit user consent:\n\n【Location Information】\n• Purpose: To provide waste collection schedules based on your area\n• Collection method: Explicit user permission requested on first app launch\n• Usage: Used only for area determination, no continuous tracking\n• Storage: Device only (not sent to external servers)\n\n【Selected Area Information】\n• Purpose: To display appropriate waste collection schedules\n• Collection method: Manually selected by user\n• Storage: Device only\n\n【Notification Settings】\n• Purpose: Waste collection day reminder notifications\n• Collection method: Only when user enables notifications\n• Storage: Device only\n\n【App Usage Data】\n• Purpose: App stability improvement and crash reporting\n• Collection method: Standard Expo/React Native framework functionality\n• Anonymous data only, cannot identify individuals'
            },
            {
              title: 'Third-Party Services and SDKs',
              content: 'The App uses the following third-party services, which provide privacy protection equal to or greater than this privacy policy:\n\n• Expo Platform (expo.dev): Core app technology\n• React Native: UI framework\n• AsyncStorage: Local data storage\n\nThese services do not transmit personal information externally. All data is processed on-device.'
            },
            {
              title: 'Data Retention and Deletion',
              content: '【Data Retention Period】\n• All data is stored only on the device\n• All data is completely deleted when the app is uninstalled\n• No external server data storage\n\n【User Data Deletion】\n1. Individual setting deletion: Reset individual settings from settings screen\n2. Complete data deletion: Uninstall the app\n3. Area setting reset: Select "Change Area" from settings screen'
            },
            {
              title: 'Consent Withdrawal and User Rights',
              content: 'Users have the following rights:\n\n【Consent Withdrawal】\n• Location access: Can be disabled from device settings\n• Notifications: Can be disabled from app settings or device settings\n• Consent can be withdrawn at any time, core app functionality remains available\n\n【Alternative Solutions】\n• If location access is denied: Manual area selection is available\n• If notifications are disabled: Schedule viewing via calendar display is available\n\n【Data Access and Correction】\n• View stored data: Current settings displayed in settings screen\n• Data correction: Can be changed anytime from settings screen'
            },
            {
              title: 'Data Minimization',
              content: 'The App follows the principle of "data minimization":\n\n• Collects only minimum data necessary for core functionality (waste collection schedule display)\n• Does not collect unnecessary personal information (name, email address, etc.)\n• No account creation or personal information input required\n• Location information used only for area determination, not continuous tracking'
            },
            {
              title: 'Security',
              content: 'The App implements the following security measures to protect user information:\n\n• All data stored with local encryption\n• Minimizes data leak risk by not performing network communication\n• Regular security audits conducted\n• Uses frameworks compliant with latest security standards'
            },
            {
              title: 'Children\'s Privacy',
              content: 'The App does not intentionally collect personal information from children under 13. If we learn that a child under 13 has provided personal information, we will promptly delete such information. If you are a parent and believe your child has provided personal information, please contact us.'
            },
            {
              title: 'Privacy Policy Changes',
              content: 'When this privacy policy is changed, we will notify users in advance within the app and seek user consent. For significant changes, we will clearly display them at app startup, and continued use will require consent to the new policy. Change history can be viewed within the app.'
            },
            {
              title: 'Contact & Data Deletion Requests',
              content: 'For privacy-related questions, data deletion requests, or other inquiries, please contact us through:\n\n• "Contact" function in app settings screen\n• Response time: Within 72 hours\n• Data deletion requests can be fulfilled immediately (completed by app deletion)\n\nIf you have questions about compliance with this privacy policy, please feel free to contact us.'
            }
          ]
        };
      
      case 'zh':
        return {
          title: '隐私政策',
          lastUpdated: '最后更新：2025年6月12日',
          sections: [
            {
              title: '简介',
              content: '"川崎市垃圾分类应用"尊重用户隐私，致力于保护个人信息。'
            },
            {
              title: '我们收集的信息',
              content: '本应用可能收集以下信息：\n\n1. 位置信息\n• 目的：根据您所在地区提供垃圾收集时间表\n• 收集方式：在获得用户明确许可后收集\n• 存储：仅在设备上（不发送到外部服务器）\n\n2. 选择的地区信息\n• 目的：显示适当的垃圾收集时间表\n• 存储：仅在设备上\n\n3. 通知设置\n• 目的：垃圾收集日提醒通知\n• 存储：仅在设备上'
            },
            {
              title: '信息使用',
              content: '收集的信息仅用于：\n• 提供准确的垃圾收集时间表\n• 发送垃圾收集通知\n• 改进应用功能'
            },
            {
              title: '第三方披露',
              content: '本应用不会向第三方出售、交易或转让用户个人信息。'
            },
            {
              title: '数据存储',
              content: '所有数据仅存储在用户设备上，不会传输到外部服务器。'
            },
            {
              title: '安全性',
              content: '本应用实施适当的安全措施来保护用户信息。'
            },
            {
              title: '儿童隐私',
              content: '本应用不会故意收集13岁以下儿童的个人信息。'
            },
            {
              title: '变更',
              content: '本隐私政策可能会在不另行通知的情况下更新。更改将在应用内通知。'
            },
            {
              title: '联系方式',
              content: '有关隐私政策的问题，请通过应用的设置界面与我们联系。'
            }
          ]
        };
      
      case 'ko':
        return {
          title: '개인정보 처리방침',
          lastUpdated: '최종 업데이트: 2025년 6월 12일',
          sections: [
            {
              title: '소개',
              content: '"가와사키시 쓰레기 분리 앱"은 사용자의 개인정보를 존중하고 보호하기 위해 노력합니다.'
            },
            {
              title: '수집하는 정보',
              content: '본 앱은 다음 정보를 수집할 수 있습니다:\n\n1. 위치 정보\n• 목적: 거주 지역에 따른 쓰레기 수거 일정 제공\n• 수집 방법: 사용자의 명시적 허가 후 수집\n• 저장: 기기에만 저장 (외부 서버로 전송되지 않음)\n\n2. 선택한 지역 정보\n• 목적: 적절한 쓰레기 수거 일정 표시\n• 저장: 기기에만 저장\n\n3. 알림 설정\n• 목적: 쓰레기 수거일 알림\n• 저장: 기기에만 저장'
            },
            {
              title: '정보 사용',
              content: '수집된 정보는 다음 목적으로만 사용됩니다:\n• 정확한 쓰레기 수거 일정 제공\n• 쓰레기 수거 알림 전송\n• 앱 기능 개선'
            },
            {
              title: '제3자 제공',
              content: '본 앱은 사용자의 개인정보를 제3자에게 판매, 거래 또는 양도하지 않습니다.'
            },
            {
              title: '데이터 저장',
              content: '모든 데이터는 사용자의 기기에만 저장되며 외부 서버로 전송되지 않습니다.'
            },
            {
              title: '보안',
              content: '본 앱은 사용자 정보를 보호하기 위해 적절한 보안 조치를 시행합니다.'
            },
            {
              title: '아동 개인정보 보호',
              content: '본 앱은 13세 미만 아동으로부터 의도적으로 개인정보를 수집하지 않습니다.'
            },
            {
              title: '변경사항',
              content: '본 개인정보 처리방침은 사전 통지 없이 변경될 수 있습니다. 변경사항은 앱 내에서 알려드립니다.'
            },
            {
              title: '문의',
              content: '개인정보 처리방침에 대한 문의는 앱의 설정 화면을 통해 연락해 주십시오.'
            }
          ]
        };
      
      default: // ja
        return {
          title: 'プライバシーポリシー',
          lastUpdated: '最終更新日: 2025年6月12日',
          sections: [
            {
              title: 'はじめに',
              content: '本アプリケーション「川崎市ごみ分別アプリ」（以下「本アプリ」）は、利用者のプライバシーを尊重し、個人情報の保護に努めています。本プライバシーポリシーは、どのような情報を収集し、どのように使用し、保護するかを明確に説明します。'
            },
            {
              title: '収集する情報とその目的',
              content: '本アプリは以下の情報を収集する場合があります。すべての情報収集は、ユーザーの明示的な同意を得た場合のみ実行されます：\n\n【位置情報】\n• 収集目的：お住まいの地域に基づいたごみ収集スケジュールの提供\n• 収集方法：アプリ初回起動時にユーザーの明示的な許可を求めます\n• 使用方法：地域判定のみに使用し、継続的な追跡は行いません\n• 保存場所：端末内のみ（外部サーバーには送信されません）\n\n【選択した地域情報】\n• 収集目的：適切なごみ収集スケジュールの表示\n• 収集方法：ユーザーが手動で選択\n• 保存場所：端末内のみ\n\n【通知設定】\n• 収集目的：ごみ収集日のリマインダー通知\n• 収集方法：ユーザーが通知を有効にした場合のみ\n• 保存場所：端末内のみ\n\n【アプリ使用状況】\n• 収集目的：アプリの安定性向上とクラッシュレポート\n• 収集方法：Expo/React Nativeフレームワークの標準機能\n• 個人を特定できない匿名データのみ'
            },
            {
              title: '第三者サービスとSDK',
              content: '本アプリは以下の第三者サービスを使用しています。これらのサービスは、本プライバシーポリシーと同等以上のプライバシー保護を提供します：\n\n• Expo Platform (expo.dev)：アプリの基盤技術\n• React Native：UI フレームワーク\n• AsyncStorage：ローカルデータ保存\n\nこれらのサービスは個人情報を外部に送信しません。すべてのデータは端末内で処理されます。'
            },
            {
              title: 'データの保持と削除',
              content: '【データ保持期間】\n• すべてのデータは端末内にのみ保存されます\n• アプリを削除することで、すべてのデータが完全に削除されます\n• 外部サーバーでのデータ保存は一切行いません\n\n【ユーザーによるデータ削除】\n1. 個別設定の削除：設定画面から各設定をリセット可能\n2. 全データの削除：アプリをアンインストール\n3. 地域設定のリセット：設定画面から「地域変更」を選択'
            },
            {
              title: '同意の撤回とユーザーの権利',
              content: 'ユーザーは以下の権利を有します：\n\n【同意の撤回】\n• 位置情報アクセス：端末の設定画面から無効化可能\n• 通知：アプリ設定画面または端末設定から無効化可能\n• いつでも同意を撤回でき、アプリの基本機能は継続して利用可能\n\n【代替手段の提供】\n• 位置情報へのアクセスを拒否した場合：手動での地域選択が可能\n• 通知を無効にした場合：カレンダー表示でスケジュール確認が可能\n\n【データアクセスと訂正】\n• 保存されたデータの確認：設定画面で現在の設定を表示\n• データの訂正：設定画面からいつでも変更可能'
            },
            {
              title: 'データの最小化',
              content: '本アプリは「データ最小化」の原則に従います：\n\n• アプリの核となる機能（ごみ収集スケジュール表示）に必要最小限のデータのみを収集\n• 不要な個人情報（氏名、メールアドレス等）は一切収集しません\n• アカウント作成や個人情報の入力は不要です\n• 位置情報も継続的な追跡ではなく、地域判定のみに使用'
            },
            {
              title: 'セキュリティ',
              content: '本アプリは、利用者の情報を保護するために以下のセキュリティ対策を実施しています：\n\n• すべてのデータをローカル暗号化して保存\n• ネットワーク通信を行わないため、データ漏洩リスクを最小化\n• 定期的なセキュリティ監査の実施\n• 最新のセキュリティ標準に準拠したフレームワークの使用'
            },
            {
              title: '子どものプライバシー',
              content: '本アプリは13歳未満の子どもから意図的に個人情報を収集することはありません。13歳未満の子どもが個人情報を提供したことが判明した場合、速やかにその情報を削除します。保護者の方で、お子様が個人情報を提供したと思われる場合は、お問い合わせください。'
            },
            {
              title: 'プライバシーポリシーの変更',
              content: '本プライバシーポリシーを変更する場合は、アプリ内で事前に通知し、ユーザーの同意を求めます。重要な変更については、アプリ起動時に明確に表示し、継続使用には新しいポリシーへの同意が必要となります。変更履歴はアプリ内で確認できます。'
            },
            {
              title: 'お問い合わせ・データ削除要求',
              content: 'プライバシーに関するご質問、データ削除要求、またはその他のお問い合わせは、以下の方法で承ります：\n\n• アプリ内設定画面の「お問い合わせ」機能\n• ご要求への対応時間：72時間以内\n• データ削除要求は即座に対応可能（アプリ削除により完了）\n\n本プライバシーポリシーの遵守状況について疑問がある場合は、お気軽にお問い合わせください。'
            }
          ]
        };
    }
  };

  const content = getContent();

  return (
    <>
      <Stack.Screen
        options={{
          title: content.title,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ paddingHorizontal: Platform.OS === 'ios' ? 0 : 16 }}
            >
              <Ionicons name="arrow-back" size={24} color={tintColor} />
            </TouchableOpacity>
          ),
        }}
      />
      <ThemedView style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <ThemedText style={styles.lastUpdated}>{content.lastUpdated}</ThemedText>
          
          {content.sections.map((section, index) => (
            <View key={index} style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                {section.title}
              </ThemedText>
              <ThemedText style={styles.sectionContent}>
                {section.content}
              </ThemedText>
            </View>
          ))}
        </ScrollView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  lastUpdated: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  sectionContent: {
    lineHeight: 22,
  },
});