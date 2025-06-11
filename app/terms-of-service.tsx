import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Platform, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function TermsOfServiceScreen() {
  const { language } = useLocalization();
  const router = useRouter();
  const tintColor = useThemeColor({}, 'tint');

  const getContent = () => {
    switch (language) {
      case 'en':
        return {
          title: 'Terms of Service',
          lastUpdated: 'Last updated: January 1, 2024',
          sections: [
            {
              title: 'Article 1 (Application)',
              content: 'These Terms of Service are intended to define the rights and obligations between users and the provider of the Kawasaki City Waste Sorting App (hereinafter referred to as "the App"), and apply to all relationships related to the use of the App between users and the provider.'
            },
            {
              title: 'Article 2 (User Registration)',
              content: 'To use the App, users must agree to these Terms and complete user registration. By applying for user registration, the applicant is deemed to have agreed to these Terms.'
            },
            {
              title: 'Article 3 (Purpose of the App)',
              content: 'The purpose of this App is to provide users with information about waste sorting methods and collection schedules in Kawasaki City.'
            },
            {
              title: 'Article 4 (User Obligations)',
              content: 'Users must comply with the following when using the App:\n1. Comply with laws and these Terms\n2. Use the App only for appropriate purposes\n3. Do not engage in acts that cause trouble to other users or third parties\n4. Do not engage in unauthorized access or interference with the App\'s system'
            },
            {
              title: 'Article 5 (Prohibited Acts)',
              content: 'Users must not engage in the following acts when using the App:\n1. Acts that infringe intellectual property rights of the provider, other users, or third parties\n2. Acts related to criminal activities or acts that promote criminal activities\n3. Acts that violate laws or are likely to violate laws\n4. Acts that interfere with the operation of the App\n5. Other acts deemed inappropriate by the provider'
            },
            {
              title: 'Article 6 (Disclaimer)',
              content: '1. The provider makes no warranties regarding the accuracy, completeness, usefulness, etc. of the App\'s content or information.\n2. The provider shall not be liable for any damages caused to users by the use of the App.\n3. This App is not an official application of Kawasaki City. Please check official Kawasaki City information for final decisions regarding waste sorting and collection.'
            },
            {
              title: 'Article 7 (Privacy)',
              content: 'The provider respects user privacy and handles personal information in accordance with the separately defined Privacy Policy.'
            },
            {
              title: 'Article 8 (Notification Function)',
              content: 'The App may provide notification functions such as reminders for waste collection days. Users can manage notification reception through their device settings.'
            },
            {
              title: 'Article 9 (Service Changes, Interruption, Termination)',
              content: 'The provider may change the content of the App or interrupt or terminate the provision of the App without prior notice to users. The provider shall not be liable for any damages caused to users by these actions.'
            },
            {
              title: 'Article 10 (Changes to Terms of Service)',
              content: 'The provider may change these Terms at any time. The revised Terms of Service shall take effect when posted within the App.'
            },
            {
              title: 'Article 11 (Governing Law and Jurisdiction)',
              content: 'The interpretation and application of these Terms shall be governed by Japanese law. In case of disputes related to the App, Tokyo District Court shall be the exclusive agreed jurisdiction court of first instance.'
            }
          ],
          footer: 'Established: January 1, 2024\nLast Updated: January 1, 2024',
          contact: 'For inquiries about these Terms of Service, please use the contact function within the App.'
        };
      
      case 'zh':
        return {
          title: '服务条款',
          lastUpdated: '最后更新：2024年1月1日',
          sections: [
            {
              title: '第一条（适用）',
              content: '本条款旨在规定用户与川崎市垃圾分类应用（以下简称"本应用"）提供方之间的权利义务关系，适用于用户与提供方之间与本应用使用相关的所有关系。'
            },
            {
              title: '第二条（用户注册）',
              content: '使用本应用时，用户必须同意本条款并完成用户注册。申请用户注册时，申请人即视为已同意本条款。'
            },
            {
              title: '第三条（应用目的）',
              content: '本应用的目的是为用户提供川崎市废物分类方法和收集时间表的信息。'
            },
            {
              title: '第四条（用户义务）',
              content: '用户在使用本应用时必须遵守以下事项：\n1. 遵守法律法规和本条款\n2. 仅出于适当目的使用本应用\n3. 不得从事给其他用户或第三方造成困扰的行为\n4. 不得对本应用系统进行非法访问或干扰行为'
            },
            {
              title: '第五条（禁止行为）',
              content: '用户在使用本应用时不得从事以下行为：\n1. 侵犯提供方、其他用户或第三方知识产权的行为\n2. 与犯罪活动相关或促进犯罪活动的行为\n3. 违反法律或可能违反法律的行为\n4. 妨碍本应用运营的行为\n5. 其他被提供方认为不当的行为'
            },
            {
              title: '第六条（免责条款）',
              content: '1. 提供方不对本应用内容或信息的准确性、完整性、有用性等做任何保证。\n2. 提供方对因使用本应用而给用户造成的损害不承担任何责任。\n3. 本应用不是川崎市官方应用程序。有关废物分类和收集的最终决定，请查看川崎市官方信息。'
            },
            {
              title: '第七条（隐私）',
              content: '提供方尊重用户隐私，根据单独制定的隐私政策处理个人信息。'
            },
            {
              title: '第八条（通知功能）',
              content: '本应用可能提供垃圾收集日提醒等通知功能。用户可以通过设备设置管理通知接收。'
            },
            {
              title: '第九条（服务变更、中断、终止）',
              content: '提供方可在不事先通知用户的情况下更改本应用内容或中断或终止本应用的提供。提供方对因此给用户造成的损害不承担任何责任。'
            },
            {
              title: '第十条（条款变更）',
              content: '提供方可随时更改本条款。修订后的服务条款在应用内发布时生效。'
            },
            {
              title: '第十一条（适用法律和管辖）',
              content: '本条款的解释和适用受日本法律管辖。如发生与本应用相关的争议，东京地方法院为第一审专属合意管辖法院。'
            }
          ],
          footer: '制定日期：2024年1月1日\n最后更新：2024年1月1日',
          contact: '有关本服务条款的咨询，请使用应用内的联系功能。'
        };
      
      case 'ko':
        return {
          title: '이용약관',
          lastUpdated: '최종 업데이트: 2024년 1월 1일',
          sections: [
            {
              title: '제1조 (적용)',
              content: '본 약관은 가와사키시 쓰레기 분리배출 앱(이하 "본 앱"이라 함)의 이용에 관하여 이용자와 본 앱 제공자(이하 "당방"이라 함) 간의 권리의무관계를 정함을 목적으로 하며, 이용자와 당방 간의 본 앱 이용에 관한 모든 관계에 적용됩니다.'
            },
            {
              title: '제2조 (이용등록)',
              content: '본 앱의 이용에 있어서 이용자는 본 약관에 동의한 후 이용등록을 하는 것으로 합니다. 이용등록을 신청한 시점에서 신청자는 본 약관에 동의한 것으로 간주합니다.'
            },
            {
              title: '제3조 (본 앱의 목적)',
              content: '본 앱은 가와사키시의 폐기물 분리배출 방법 및 수거 일정에 관한 정보를 이용자에게 제공하는 것을 목적으로 합니다.'
            },
            {
              title: '제4조 (이용자의 의무)',
              content: '이용자는 본 앱 이용에 있어서 다음 사항을 준수해야 합니다:\n1. 법령 및 본 약관을 준수할 것\n2. 본 앱을 적절한 목적으로만 사용할 것\n3. 다른 이용자나 제3자에게 피해를 주는 행위를 하지 않을 것\n4. 본 앱 시스템에 대한 부정 접근이나 방해 행위를 하지 않을 것'
            },
            {
              title: '제5조 (금지사항)',
              content: '이용자는 본 앱 이용에 있어서 다음 행위를 해서는 안 됩니다:\n1. 당방이나 다른 이용자, 제3자의 지적재산권을 침해하는 행위\n2. 범죄행위와 관련된 행위 또는 범죄행위를 조장하는 행위\n3. 법령에 위반하는 행위 또는 위반할 우려가 있는 행위\n4. 본 앱의 운영을 방해하는 행위\n5. 기타 당방이 부적절하다고 판단하는 행위'
            },
            {
              title: '제6조 (면책사항)',
              content: '1. 당방은 본 앱의 내용이나 정보의 정확성, 완전성, 유용성 등에 대해 어떠한 보증도 하지 않습니다.\n2. 본 앱 이용으로 인해 이용자에게 발생한 손해에 대해 당방은 일체의 책임을 지지 않습니다.\n3. 본 앱은 가와사키시 공식 애플리케이션이 아닙니다. 폐기물 분리배출 및 수거에 관한 최종 판단은 가와사키시 공식 정보를 확인해 주십시오.'
            },
            {
              title: '제7조 (개인정보보호)',
              content: '당방은 이용자의 개인정보를 존중하며, 개인정보 취급에 대해서는 별도로 정하는 개인정보 처리방침에 따릅니다.'
            },
            {
              title: '제8조 (알림기능)',
              content: '본 앱은 쓰레기 수거일 알림 등의 통지 기능을 제공할 수 있습니다. 이용자는 단말기 설정을 통해 알림 수신을 관리할 수 있습니다.'
            },
            {
              title: '제9조 (서비스 변경·중단·종료)',
              content: '당방은 이용자에게 사전 통지 없이 본 앱의 내용을 변경하거나 본 앱 제공을 중단 또는 종료할 수 있습니다. 이로 인해 이용자에게 발생한 손해에 대해 당방은 일체의 책임을 지지 않습니다.'
            },
            {
              title: '제10조 (이용약관의 변경)',
              content: '당방은 본 약관을 언제든지 변경할 수 있습니다. 변경된 이용약관은 본 앱 내에 게시된 시점부터 효력을 발생합니다.'
            },
            {
              title: '제11조 (준거법·관할법원)',
              content: '본 약관의 해석 및 적용은 일본법에 준거합니다. 본 앱에 관해 분쟁이 발생한 경우 도쿄지방법원을 제1심의 전속적 합의관할법원으로 합니다.'
            }
          ],
          footer: '제정일: 2024년 1월 1일\n최종 업데이트: 2024년 1월 1일',
          contact: '본 이용약관에 관한 문의는 앱 내 문의 기능을 이용해 주십시오.'
        };
      
      default: // ja
        return {
          title: '利用規約',
          lastUpdated: '最終更新日: 2024年1月1日',
          sections: [
            {
              title: '第1条（適用）',
              content: '本規約は、川崎市ごみ分別アプリ（以下「本アプリ」といいます）の利用に関して、利用者と本アプリの提供者（以下「当方」といいます）との間の権利義務関係を定めることを目的とし、利用者と当方との間の本アプリの利用に関わる一切の関係に適用されます。'
            },
            {
              title: '第2条（利用登録）',
              content: '本アプリの利用にあたり、利用者は本規約に同意の上で利用登録を行うものとします。利用登録の申請をした時点で、申請者は本規約に同意したものとみなします。'
            },
            {
              title: '第3条（本アプリの目的）',
              content: '本アプリは、川崎市における廃棄物の分別方法および収集日程に関する情報を利用者に提供することを目的としています。'
            },
            {
              title: '第4条（利用者の義務）',
              content: '利用者は、本アプリの利用にあたり、以下の事項を遵守するものとします：\n1. 法令及び本規約を遵守すること\n2. 本アプリを適切な目的でのみ使用すること\n3. 他の利用者や第三者に迷惑をかける行為を行わないこと\n4. 本アプリのシステムに対する不正アクセスや妨害行為を行わないこと'
            },
            {
              title: '第5条（禁止事項）',
              content: '利用者は、本アプリの利用にあたり、以下の行為をしてはなりません：\n1. 当方や他の利用者、第三者の知的財産権を侵害する行為\n2. 犯罪行為に関連する行為、または犯罪行為を助長する行為\n3. 法令に違反する行為、または違反するおそれのある行為\n4. 本アプリの運営を妨害する行為\n5. その他、当方が不適切と判断する行為'
            },
            {
              title: '第6条（免責事項）',
              content: '1. 当方は、本アプリの内容や情報の正確性、完全性、有用性等について、いかなる保証も行いません。\n2. 本アプリの利用により利用者に生じた損害について、当方は一切の責任を負いません。\n3. 本アプリは川崎市公式のアプリケーションではありません。廃棄物の分別や収集に関する最終的な判断は、川崎市の公式情報をご確認ください。'
            },
            {
              title: '第7条（プライバシー）',
              content: '当方は、利用者のプライバシーを尊重し、個人情報の取扱いについては別途定めるプライバシーポリシーに従います。'
            },
            {
              title: '第8条（通知機能）',
              content: '本アプリは、ごみ収集日のリマインダー等の通知機能を提供する場合があります。利用者は、端末の設定により通知の受信を管理することができます。'
            },
            {
              title: '第9条（サービスの変更・中断・終了）',
              content: '当方は、利用者への事前通知なく、本アプリの内容を変更し、または本アプリの提供を中断もしくは終了することができます。これらによって利用者に生じた損害について、当方は一切の責任を負いません。'
            },
            {
              title: '第10条（利用規約の変更）',
              content: '当方は、本規約を随時変更することができます。変更後の利用規約は、本アプリ内に掲示された時点で効力を生じるものとします。'
            },
            {
              title: '第11条（準拠法・管轄裁判所）',
              content: '本規約の解釈及び適用は、日本法に準拠します。本アプリに関して紛争が生じた場合には、東京地方裁判所を第一審の専属的合意管轄裁判所とします。'
            }
          ],
          footer: '制定日：2024年1月1日\n最終更新：2024年1月1日',
          contact: '本利用規約に関するお問い合わせは、アプリ内のお問い合わせ機能をご利用ください。'
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

          <ThemedText style={styles.footer}>
            {content.footer}
          </ThemedText>

          <ThemedText style={styles.contact}>
            {content.contact}
          </ThemedText>
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
  footer: {
    marginTop: 32,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  contact: {
    marginTop: 16,
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});