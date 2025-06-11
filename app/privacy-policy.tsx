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
          lastUpdated: 'Last updated: January 1, 2024',
          sections: [
            {
              title: 'Introduction',
              content: 'The "Kawasaki City Waste Sorting App" respects user privacy and is committed to protecting personal information.'
            },
            {
              title: 'Information We Collect',
              content: 'The App may collect the following information:\n\n1. Location Information\n• Purpose: To provide waste collection schedules based on your area\n• Collection method: Collected with explicit user permission\n• Storage: Device only (not sent to external servers)\n\n2. Selected Area Information\n• Purpose: To display appropriate waste collection schedules\n• Storage: Device only\n\n3. Notification Settings\n• Purpose: Waste collection day reminder notifications\n• Storage: Device only'
            },
            {
              title: 'Use of Information',
              content: 'Collected information is used only for:\n• Providing accurate waste collection schedules\n• Sending waste collection notifications\n• Improving app functionality'
            },
            {
              title: 'Third-Party Disclosure',
              content: 'The App does not sell, trade, or transfer user personal information to third parties.'
            },
            {
              title: 'Data Storage',
              content: 'All data is stored only on the user\'s device and is not transmitted to external servers.'
            },
            {
              title: 'Security',
              content: 'The App implements appropriate security measures to protect user information.'
            },
            {
              title: 'Children\'s Privacy',
              content: 'The App does not intentionally collect personal information from children under 13.'
            },
            {
              title: 'Changes',
              content: 'This privacy policy may be updated without notice. Changes will be notified within the app.'
            },
            {
              title: 'Contact',
              content: 'For questions about this privacy policy, please contact us through the app\'s settings screen.'
            }
          ]
        };
      
      case 'zh':
        return {
          title: '隐私政策',
          lastUpdated: '最后更新：2024年1月1日',
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
          lastUpdated: '최종 업데이트: 2024년 1월 1일',
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
          lastUpdated: '最終更新日: 2024年1月1日',
          sections: [
            {
              title: 'はじめに',
              content: '本アプリケーション「川崎市ごみ分別アプリ」は、利用者のプライバシーを尊重し、個人情報の保護に努めています。'
            },
            {
              title: '収集する情報',
              content: '本アプリは以下の情報を収集する場合があります：\n\n1. 位置情報\n• 収集目的：お住まいの地域に基づいたごみ収集スケジュールの提供\n• 収集方法：ユーザーの明示的な許可を得た上で収集\n• 保存場所：端末内のみ（外部サーバーには送信されません）\n\n2. 選択した地域情報\n• 収集目的：適切なごみ収集スケジュールの表示\n• 保存場所：端末内のみ\n\n3. 通知設定\n• 収集目的：ごみ収集日のリマインダー通知\n• 保存場所：端末内のみ'
            },
            {
              title: '情報の利用目的',
              content: '収集した情報は以下の目的でのみ使用されます：\n• 正確なごみ収集スケジュールの提供\n• ごみ収集日の通知\n• アプリの機能改善'
            },
            {
              title: '第三者への提供',
              content: '本アプリは、利用者の個人情報を第三者に販売、取引、または譲渡することはありません。'
            },
            {
              title: 'データの保存',
              content: 'すべてのデータは利用者の端末内にのみ保存され、外部サーバーには送信されません。'
            },
            {
              title: 'セキュリティ',
              content: '本アプリは、利用者の情報を保護するために適切なセキュリティ対策を実施しています。'
            },
            {
              title: '子どものプライバシー',
              content: '本アプリは13歳未満の子どもから意図的に個人情報を収集することはありません。'
            },
            {
              title: '変更について',
              content: '本プライバシーポリシーは予告なく変更される場合があります。変更があった場合は、アプリ内でお知らせします。'
            },
            {
              title: 'お問い合わせ',
              content: 'プライバシーポリシーに関するご質問は、アプリ内の設定画面からお問い合わせください。'
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