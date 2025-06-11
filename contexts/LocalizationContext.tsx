import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'ja' | 'en' | 'zh' | 'ko';

interface LocalizationContextType {
  language: Language;
  currentLanguage: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
}

const translations = {
  ja: {
    // App
    'app.title': '川崎市ごみ分別アプリ',
    'app.subtitle': 'Kawasaki City Waste Sorting',
    
    // Tab names
    'tabs.home': 'ホーム',
    'tabs.calendar': 'カレンダー',
    'tabs.search': '検索',
    'tabs.camera': 'カメラ',
    'tabs.settings': '設定',
    
    // Onboarding
    'onboarding.welcome': 'ようこそ',
    'onboarding.selectLanguage': '言語を選択してください',
    'onboarding.selectWard': 'お住まいの区を選択してください',
    'onboarding.selectArea': 'お住まいの地域を選択してください',
    'onboarding.enableNotifications': '通知を有効にしますか？',
    'onboarding.complete': '設定完了',
    'onboarding.next': '次へ',
    'onboarding.skip': 'スキップ',
    
    // Home screen
    'home.title': '今日のごみ収集',
    'home.todayCollection': '今日の収集',
    'home.nextCollection': '次回の収集',
    'home.noCollection': '収集なし',
    'home.menuTitle': 'メニュー',
    'home.calendar': 'カレンダー',
    'home.search': '分別検索',
    'home.camera': 'カメラで識別',
    'home.settings': '設定',
    
    // Waste categories
    'waste.burnable': '燃やすごみ',
    'waste.nonBurnable': '燃やさないごみ',
    'waste.recyclable': '資源ごみ',
    'waste.oversized': '粗大ごみ',
    
    // Calendar
    'calendar.title': '収集カレンダー',
    'calendar.month': '月',
    'calendar.today': '今日',
    
    // Search
    'search.title': 'ごみ分別検索',
    'search.placeholder': 'ごみの名前を入力してください',
    'search.results': '検索結果',
    'search.noResults': '検索結果がありません',
    'search.history': '検索履歴',
    'search.clearHistory': '履歴をクリア',
    
    // Camera
    'camera.title': 'カメラで識別',
    'camera.takePhoto': '写真を撮る',
    'camera.analyzing': '分析中...',
    'camera.result': '認識結果',
    'camera.confidence': '信頼度',
    'camera.tryAgain': 'もう一度撮影',
    'camera.permission': 'カメラの使用許可が必要です',
    
    // Settings
    'settings.title': '設定',
    'settings.language': '言語',
    'settings.area': '収集地域',
    'settings.changeArea': '地域を変更',
    'settings.notifications': '通知設定',
    'settings.notificationTime': '通知時間',
    'settings.notificationTypes': '通知する種類',
    'settings.theme': 'テーマ',
    'settings.about': 'このアプリについて',
    'settings.version': 'バージョン',
    'settings.contact': 'お問い合わせ',
    
    // Notifications
    'notification.evening': '前日の夜',
    'notification.morning': '当日の朝',
    'notification.title': 'ごみ収集のお知らせ',
    'notification.tomorrowCollection': '明日は{type}の収集日です',
    'notification.todayCollection': '今日は{type}の収集日です',
    'notification.timeSettings': '通知時間設定',
    'notification.timeSettingsDescription': '通知を受け取る時間を設定できます',
    'notification.eveningNotification': '前日夜の通知',
    'notification.eveningDescription': '収集日前日の夜に通知します',
    'notification.morningNotification': '当日朝の通知',
    'notification.morningDescription': '収集日当日の朝に通知します',
    'notification.time': '時刻',
    'notification.eveningTimeUpdated': '夜の通知時間を更新しました',
    'notification.morningTimeUpdated': '朝の通知時間を更新しました',
    'notification.timeSettingsInfo': '通知時間はお好みに合わせて設定できます',
    
    // Wards
    'ward.kawasaki': '川崎区',
    'ward.saiwai': '幸区',
    'ward.nakahara': '中原区',
    'ward.takatsu': '高津区',
    'ward.miyamae': '宮前区',
    'ward.tama': '多摩区',
    'ward.asao': '麻生区',
    
    // Common
    'common.save': '保存',
    'common.cancel': 'キャンセル',
    'common.ok': 'OK',
    'common.error': 'エラー',
    'common.success': '成功',
    'common.loading': '読み込み中...',
    'common.retry': '再試行',
    'common.back': '戻る',
    'common.close': '閉じる',
    'common.select': '選択',
    'common.confirm': '確認',
    
    // Home specific
    'home.sectionTitle': 'ごみ分別のポイント',
    'home.noticeTitle': '分別のコツ',
    'home.noticeDescription': '可燃ごみは水気をよく切って、資源ごみは軽く洗って出しましょう',
    'home.tomorrowSchedule': '明日以降の収集予定をご確認ください',
    'home.collectionInstructions': '朝8時までに指定場所に出してください',
    
    // Search specific
    'search.emptyHistory': '検索履歴がありません',
    'search.emptyHistorySubtitle': 'ごみの名前を検索してみましょう',
    'search.noResultsSubtitle': '別のキーワードで検索してみてください',
    'search.categoryLabel': '分類',
    'search.instructionsLabel': '出し方',
    
    // Settings specific
    'settings.userSettings': 'ユーザー設定',
    'settings.languageSubtitle': 'アプリの表示言語を変更',
    'settings.areaSubtitle': 'お住まいの区を変更',
    'settings.notificationCollection': '収集日通知',
    'settings.notificationCollectionSubtitle': 'ごみ収集日の前日・当日に通知',
    'settings.notificationTimeSubtitle': '通知する時間帯を設定',
    'settings.notificationTimeValue': '前日19:00, 当日7:00',
    'settings.appInfo': 'アプリ情報',
    'settings.versionSubtitle': '現在のアプリバージョン',
    'settings.aboutSubtitle': 'アプリについて',
    'settings.contactSubtitle': 'お問い合わせ・フィードバック',
    'settings.legal': '利用規約・プライバシー',
    'settings.terms': '利用規約',
    'settings.termsSubtitle': 'アプリの利用規約を確認',
    'settings.termsOfService': '利用規約',
    'settings.privacy': 'プライバシーポリシー',
    'settings.privacySubtitle': 'プライバシーポリシーを確認',
    'settings.appName': '川崎市ごみ分別アプリ',
    'settings.footerMessage': '環境保護のために、正しいごみ分別を心がけましょう',
    'settings.changeAreaConfirm': '地域を変更すると言語選択画面に戻ります。よろしいですか？',
    'settings.notificationEnabled': '通知が有効になりました',
    'settings.notificationDisabled': '通知が無効になりました',
    'settings.aboutMessage': '川崎市ごみ分別アプリ\nバージョン: {version}\n\n川崎市民のためのごみ分別支援アプリです。適切な分別で環境保護に貢献しましょう。',
    'settings.contactMessage': 'お問い合わせ機能は実装予定です。',
    'settings.notificationTimeMessage': '通知時間設定機能は実装予定です。',
    'settings.termsMessage': '利用規約機能は実装予定です。',
    'settings.privacyMessage': 'プライバシーポリシー機能は実装予定です。',
    'settings.unset': '未設定',
    'settings.notificationError': '通知設定の更新に失敗しました。',
    'settings.saved': '保存しました',
    
    // Notification specific
    'notification.permissionDenied': '通知の許可が必要です。設定から通知を有効にしてください。',
  },
  en: {
    // App
    'app.title': 'Kawasaki City Waste Sorting App',
    'app.subtitle': 'Kawasaki City Waste Sorting',
    
    // Tab names
    'tabs.home': 'Home',
    'tabs.calendar': 'Calendar',
    'tabs.search': 'Search',
    'tabs.camera': 'Camera',
    'tabs.settings': 'Settings',
    
    // Onboarding
    'onboarding.welcome': 'Welcome',
    'onboarding.selectLanguage': 'Please select your language',
    'onboarding.selectWard': 'Please select your ward',
    'onboarding.selectArea': 'Please select your area',
    'onboarding.enableNotifications': 'Enable notifications?',
    'onboarding.complete': 'Setup Complete',
    'onboarding.next': 'Next',
    'onboarding.skip': 'Skip',
    
    // Home screen
    'home.title': "Today's Collection",
    'home.todayCollection': "Today's Collection",
    'home.nextCollection': 'Next Collection',
    'home.noCollection': 'No Collection',
    'home.menuTitle': 'Menu',
    'home.calendar': 'Calendar',
    'home.search': 'Search',
    'home.camera': 'Camera ID',
    'home.settings': 'Settings',
    
    // Waste categories
    'waste.burnable': 'Burnable',
    'waste.nonBurnable': 'Non-burnable',
    'waste.recyclable': 'Recyclable',
    'waste.oversized': 'Oversized',
    
    // Calendar
    'calendar.title': 'Collection Calendar',
    'calendar.month': 'Month',
    'calendar.today': 'Today',
    
    // Search
    'search.title': 'Waste Sorting Search',
    'search.placeholder': 'Enter item name',
    'search.results': 'Search Results',
    'search.noResults': 'No results found',
    'search.history': 'Search History',
    'search.clearHistory': 'Clear History',
    
    // Camera
    'camera.title': 'Camera Recognition',
    'camera.takePhoto': 'Take Photo',
    'camera.analyzing': 'Analyzing...',
    'camera.result': 'Recognition Result',
    'camera.confidence': 'Confidence',
    'camera.tryAgain': 'Try Again',
    'camera.permission': 'Camera permission required',
    
    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.area': 'Collection Area',
    'settings.changeArea': 'Change Area',
    'settings.notifications': 'Notifications',
    'settings.notificationTime': 'Notification Time',
    'settings.notificationTypes': 'Notification Types',
    'settings.theme': 'Theme',
    'settings.about': 'About',
    'settings.version': 'Version',
    'settings.contact': 'Contact',
    
    // Notifications
    'notification.evening': 'Previous Evening',
    'notification.morning': 'Morning Of',
    'notification.title': 'Waste Collection Reminder',
    'notification.tomorrowCollection': 'Tomorrow is {type} collection day',
    'notification.todayCollection': 'Today is {type} collection day',
    'notification.timeSettings': 'Notification Time Settings',
    'notification.timeSettingsDescription': 'Set the time you want to receive notifications',
    'notification.eveningNotification': 'Evening Notification',
    'notification.eveningDescription': 'Notify on the evening before collection day',
    'notification.morningNotification': 'Morning Notification',
    'notification.morningDescription': 'Notify on the morning of collection day',
    'notification.time': 'Time',
    'notification.eveningTimeUpdated': 'Evening notification time updated',
    'notification.morningTimeUpdated': 'Morning notification time updated',
    'notification.timeSettingsInfo': 'You can customize notification times to your preference',
    
    // Wards
    'ward.kawasaki': 'Kawasaki Ward',
    'ward.saiwai': 'Saiwai Ward',
    'ward.nakahara': 'Nakahara Ward',
    'ward.takatsu': 'Takatsu Ward',
    'ward.miyamae': 'Miyamae Ward',
    'ward.tama': 'Tama Ward',
    'ward.asao': 'Asao Ward',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.ok': 'OK',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.loading': 'Loading...',
    'common.retry': 'Retry',
    'common.back': 'Back',
    'common.close': 'Close',
    'common.select': 'Select',
    'common.confirm': 'Confirm',
    
    // Home specific
    'home.sectionTitle': 'Waste Sorting Tips',
    'home.noticeTitle': 'Sorting Tips',
    'home.noticeDescription': 'Drain water well from burnable waste, rinse recyclables lightly',
    'home.tomorrowSchedule': 'Please check future collection schedule',
    'home.collectionInstructions': 'Put out by 8 AM at designated location',
    
    // Search specific
    'search.emptyHistory': 'No search history',
    'search.emptyHistorySubtitle': 'Try searching for waste items',
    'search.noResultsSubtitle': 'Try searching with different keywords',
    'search.categoryLabel': 'Category',
    'search.instructionsLabel': 'Instructions',
    
    // Settings specific
    'settings.userSettings': 'User Settings',
    'settings.languageSubtitle': 'Change app display language',
    'settings.areaSubtitle': 'Change your ward',
    'settings.notificationCollection': 'Collection Notifications',
    'settings.notificationCollectionSubtitle': 'Notify on day before and day of collection',
    'settings.notificationTimeSubtitle': 'Set notification time',
    'settings.notificationTimeValue': 'Previous day 7:00 PM, Collection day 7:00 AM',
    'settings.appInfo': 'App Information',
    'settings.versionSubtitle': 'Current app version',
    'settings.aboutSubtitle': 'About this app',
    'settings.contactSubtitle': 'Contact & Feedback',
    'settings.legal': 'Terms & Privacy',
    'settings.terms': 'Terms of Service',
    'settings.termsSubtitle': 'View terms of service',
    'settings.termsOfService': 'Terms of Service',
    'settings.privacy': 'Privacy Policy',
    'settings.privacySubtitle': 'View privacy policy',
    'settings.appName': 'Kawasaki City Waste Sorting App',
    'settings.footerMessage': 'Let\'s contribute to environmental protection through proper waste sorting',
    'settings.changeAreaConfirm': 'Changing area will return to language selection. Are you sure?',
    'settings.notificationEnabled': 'Notifications enabled',
    'settings.notificationDisabled': 'Notifications disabled',
    'settings.aboutMessage': 'Kawasaki City Waste Sorting App\nVersion: {version}\n\nA waste sorting support app for Kawasaki City residents. Let\'s contribute to environmental protection through proper sorting.',
    'settings.contactMessage': 'Contact feature is under development.',
    'settings.notificationTimeMessage': 'Notification time setting feature is under development.',
    'settings.termsMessage': 'Terms of service feature is under development.',
    'settings.privacyMessage': 'Privacy policy feature is under development.',
    'settings.unset': 'Not set',
    'settings.notificationError': 'Failed to update notification settings.',
    'settings.saved': 'Saved',
    
    // Notification specific
    'notification.permissionDenied': 'Notification permission is required. Please enable notifications in settings.',
  },
  zh: {
    // App
    'app.title': '川崎市垃圾分类应用',
    'app.subtitle': 'Kawasaki City Waste Sorting',
    
    // Tab names
    'tabs.home': '主页',
    'tabs.calendar': '日历',
    'tabs.search': '搜索',
    'tabs.camera': '相机',
    'tabs.settings': '设置',
    
    // Onboarding
    'onboarding.welcome': '欢迎',
    'onboarding.selectLanguage': '请选择您的语言',
    'onboarding.selectWard': '请选择您所在的区',
    'onboarding.selectArea': '请选择您所在的地区',
    'onboarding.enableNotifications': '启用通知？',
    'onboarding.complete': '设置完成',
    'onboarding.next': '下一步',
    'onboarding.skip': '跳过',
    
    // Home screen
    'home.title': '今日垃圾收集',
    'home.todayCollection': '今日收集',
    'home.nextCollection': '下次收集',
    'home.noCollection': '无收集',
    'home.menuTitle': '菜单',
    'home.calendar': '日历',
    'home.search': '分类搜索',
    'home.camera': '相机识别',
    'home.settings': '设置',
    
    // Waste categories
    'waste.burnable': '可燃垃圾',
    'waste.nonBurnable': '不可燃垃圾',
    'waste.recyclable': '可回收垃圾',
    'waste.oversized': '大型垃圾',
    
    // Calendar
    'calendar.title': '收集日历',
    'calendar.month': '月',
    'calendar.today': '今天',
    
    // Search
    'search.title': '垃圾分类搜索',
    'search.placeholder': '请输入物品名称',
    'search.results': '搜索结果',
    'search.noResults': '未找到结果',
    'search.history': '搜索历史',
    'search.clearHistory': '清除历史',
    
    // Camera
    'camera.title': '相机识别',
    'camera.takePhoto': '拍照',
    'camera.analyzing': '分析中...',
    'camera.result': '识别结果',
    'camera.confidence': '可信度',
    'camera.tryAgain': '重试',
    'camera.permission': '需要相机权限',
    
    // Settings
    'settings.title': '设置',
    'settings.language': '语言',
    'settings.area': '收集区域',
    'settings.changeArea': '更改区域',
    'settings.notifications': '通知',
    'settings.notificationTime': '通知时间',
    'settings.notificationTypes': '通知类型',
    'settings.theme': '主题',
    'settings.about': '关于',
    'settings.version': '版本',
    'settings.contact': '联系我们',
    
    // Notifications
    'notification.evening': '前一天晚上',
    'notification.morning': '当天早上',
    'notification.title': '垃圾收集提醒',
    'notification.tomorrowCollection': '明天是{type}收集日',
    'notification.todayCollection': '今天是{type}收集日',
    
    // Wards
    'ward.kawasaki': '川崎区',
    'ward.saiwai': '幸区',
    'ward.nakahara': '中原区',
    'ward.takatsu': '高津区',
    'ward.miyamae': '宫前区',
    'ward.tama': '多摩区',
    'ward.asao': '麻生区',
    
    // Common
    'common.save': '保存',
    'common.cancel': '取消',
    'common.ok': '确定',
    'common.error': '错误',
    'common.success': '成功',
    'common.loading': '加载中...',
    'common.retry': '重试',
    'common.back': '返回',
    'common.close': '关闭',
    'common.select': '选择',
    'common.confirm': '确认',
    
    // Home specific
    'home.sectionTitle': '垃圾分类要点',
    'home.noticeTitle': '分类小贴士',
    'home.noticeDescription': '可燃垃圾请充分沥干水分，资源垃圾请轻微清洗后丢弃',
    'home.tomorrowSchedule': '请查看未来的收集计划',
    'home.collectionInstructions': '请在早上8点前放到指定地点',
    
    // Search specific
    'search.emptyHistory': '没有搜索历史',
    'search.emptyHistorySubtitle': '试试搜索垃圾物品',
    'search.noResultsSubtitle': '请尝试使用不同的关键词搜索',
    'search.categoryLabel': '分类',
    'search.instructionsLabel': '处理方法',
    
    // Settings specific
    'settings.userSettings': '用户设置',
    'settings.languageSubtitle': '更改应用显示语言',
    'settings.areaSubtitle': '更改您所在的区',
    'settings.notificationCollection': '收集日通知',
    'settings.notificationCollectionSubtitle': '在收集日前一天和当天通知',
    'settings.notificationTimeSubtitle': '设置通知时间',
    'settings.notificationTimeValue': '前一天晚上7点，收集日早上7点',
    'settings.appInfo': '应用信息',
    'settings.versionSubtitle': '当前应用版本',
    'settings.aboutSubtitle': '关于此应用',
    'settings.contactSubtitle': '联系方式和反馈',
    'settings.legal': '条款和隐私',
    'settings.terms': '服务条款',
    'settings.termsSubtitle': '查看服务条款',
    'settings.termsOfService': '服务条款',
    'settings.privacy': '隐私政策',
    'settings.privacySubtitle': '查看隐私政策',
    'settings.appName': '川崎市垃圾分类应用',
    'settings.footerMessage': '让我们通过正确的垃圾分类为环境保护做贡献',
    'settings.changeAreaConfirm': '更改地区将返回语言选择界面。您确定吗？',
    'settings.notificationEnabled': '已启用通知',
    'settings.notificationDisabled': '已禁用通知',
    'settings.aboutMessage': '川崎市垃圾分类应用\n版本：{version}\n\n为川崎市居民提供的垃圾分类支持应用。让我们通过正确分类为环境保护做贡献。',
    'settings.contactMessage': '联系功能正在开发中。',
    'settings.notificationTimeMessage': '通知时间设置功能正在开发中。',
    'settings.termsMessage': '服务条款功能正在开发中。',
    'settings.privacyMessage': '隐私政策功能正在开发中。',
    'settings.unset': '未设置',
    'settings.notificationError': '更新通知设置失败。',
    'settings.saved': '已保存',
    
    // Notification specific
    'notification.permissionDenied': '需要通知权限。请在设置中启用通知。',
  },
  ko: {
    // App
    'app.title': '가와사키시 쓰레기 분리배출 앱',
    'app.subtitle': 'Kawasaki City Waste Sorting',
    
    // Tab names
    'tabs.home': '홈',
    'tabs.calendar': '캘린더',
    'tabs.search': '검색',
    'tabs.camera': '카메라',
    'tabs.settings': '설정',
    
    // Onboarding
    'onboarding.welcome': '환영합니다',
    'onboarding.selectLanguage': '언어를 선택해주세요',
    'onboarding.selectWard': '거주하시는 구를 선택해주세요',
    'onboarding.selectArea': '거주하시는 지역을 선택해주세요',
    'onboarding.enableNotifications': '알림을 활성화하시겠습니까?',
    'onboarding.complete': '설정 완료',
    'onboarding.next': '다음',
    'onboarding.skip': '건너뛰기',
    
    // Home screen
    'home.title': '오늘의 쓰레기 수거',
    'home.todayCollection': '오늘 수거',
    'home.nextCollection': '다음 수거',
    'home.noCollection': '수거 없음',
    'home.menuTitle': '메뉴',
    'home.calendar': '캘린더',
    'home.search': '분리배출 검색',
    'home.camera': '카메라 인식',
    'home.settings': '설정',
    
    // Waste categories
    'waste.burnable': '타는 쓰레기',
    'waste.nonBurnable': '타지 않는 쓰레기',
    'waste.recyclable': '재활용 쓰레기',
    'waste.oversized': '대형 쓰레기',
    
    // Calendar
    'calendar.title': '수거 캘린더',
    'calendar.month': '월',
    'calendar.today': '오늘',
    
    // Search
    'search.title': '쓰레기 분리배출 검색',
    'search.placeholder': '물품명을 입력하세요',
    'search.results': '검색 결과',
    'search.noResults': '검색 결과가 없습니다',
    'search.history': '검색 기록',
    'search.clearHistory': '기록 지우기',
    
    // Camera
    'camera.title': '카메라 인식',
    'camera.takePhoto': '사진 촬영',
    'camera.analyzing': '분석 중...',
    'camera.result': '인식 결과',
    'camera.confidence': '신뢰도',
    'camera.tryAgain': '다시 시도',
    'camera.permission': '카메라 권한이 필요합니다',
    
    // Settings
    'settings.title': '설정',
    'settings.language': '언어',
    'settings.area': '수거 지역',
    'settings.changeArea': '지역 변경',
    'settings.notifications': '알림',
    'settings.notificationTime': '알림 시간',
    'settings.notificationTypes': '알림 종류',
    'settings.theme': '테마',
    'settings.about': '정보',
    'settings.version': '버전',
    'settings.contact': '문의',
    
    // Notifications
    'notification.evening': '전날 저녁',
    'notification.morning': '당일 아침',
    'notification.title': '쓰레기 수거 알림',
    'notification.tomorrowCollection': '내일은 {type} 수거일입니다',
    'notification.todayCollection': '오늘은 {type} 수거일입니다',
    
    // Wards
    'ward.kawasaki': '가와사키구',
    'ward.saiwai': '사이와이구',
    'ward.nakahara': '나카하라구',
    'ward.takatsu': '다카쓰구',
    'ward.miyamae': '미야마에구',
    'ward.tama': '다마구',
    'ward.asao': '아사오구',
    
    // Common
    'common.save': '저장',
    'common.cancel': '취소',
    'common.ok': '확인',
    'common.error': '오류',
    'common.success': '성공',
    'common.loading': '로딩 중...',
    'common.retry': '재시도',
    'common.back': '뒤로',
    'common.close': '닫기',
    'common.select': '선택',
    'common.confirm': '확인',
    
    // Home specific
    'home.sectionTitle': '쓰레기 분리배출 요령',
    'home.noticeTitle': '분리배출 팁',
    'home.noticeDescription': '타는 쓰레기는 물기를 잘 빼고, 재활용품은 가볍게 세척 후 배출하세요',
    'home.tomorrowSchedule': '향후 수거 일정을 확인해 주세요',
    'home.collectionInstructions': '오전 8시까지 지정된 장소에 배출해 주세요',
    
    // Search specific
    'search.emptyHistory': '검색 기록이 없습니다',
    'search.emptyHistorySubtitle': '쓰레기 항목을 검색해 보세요',
    'search.noResultsSubtitle': '다른 키워드로 검색해 보세요',
    'search.categoryLabel': '분류',
    'search.instructionsLabel': '배출 방법',
    
    // Settings specific
    'settings.userSettings': '사용자 설정',
    'settings.languageSubtitle': '앱 표시 언어 변경',
    'settings.areaSubtitle': '거주 구 변경',
    'settings.notificationCollection': '수거일 알림',
    'settings.notificationCollectionSubtitle': '수거일 전날과 당일에 알림',
    'settings.notificationTimeSubtitle': '알림 시간 설정',
    'settings.notificationTimeValue': '전날 오후 7시, 수거일 오전 7시',
    'settings.appInfo': '앱 정보',
    'settings.versionSubtitle': '현재 앱 버전',
    'settings.aboutSubtitle': '이 앱에 대해',
    'settings.contactSubtitle': '문의 및 피드백',
    'settings.legal': '약관 및 개인정보',
    'settings.terms': '이용약관',
    'settings.termsSubtitle': '이용약관 보기',
    'settings.termsOfService': '이용약관',
    'settings.privacy': '개인정보 처리방침',
    'settings.privacySubtitle': '개인정보 처리방침 보기',
    'settings.appName': '가와사키시 쓰레기 분리배출 앱',
    'settings.footerMessage': '올바른 쓰레기 분리배출로 환경보호에 기여합시다',
    'settings.changeAreaConfirm': '지역을 변경하면 언어 선택 화면으로 돌아갑니다. 계속하시겠습니까?',
    'settings.notificationEnabled': '알림이 활성화되었습니다',
    'settings.notificationDisabled': '알림이 비활성화되었습니다',
    'settings.aboutMessage': '가와사키시 쓰레기 분리배출 앱\n버전: {version}\n\n가와사키시 주민을 위한 쓰레기 분리배출 지원 앱입니다. 올바른 분리배출로 환경보호에 기여합시다.',
    'settings.contactMessage': '문의 기능은 개발 중입니다.',
    'settings.notificationTimeMessage': '알림 시간 설정 기능은 개발 중입니다.',
    'settings.termsMessage': '이용약관 기능은 개발 중입니다.',
    'settings.privacyMessage': '개인정보 처리방침 기능은 개발 중입니다.',
    'settings.unset': '설정되지 않음',
    'settings.notificationError': '알림 설정 업데이트에 실패했습니다.',
    'settings.saved': '저장됨',
    
    // Notification specific
    'notification.permissionDenied': '알림 권한이 필요합니다. 설정에서 알림을 활성화해 주세요.',
  },
};

export const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ja');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (savedLanguage && savedLanguage in translations) {
        setLanguageState(savedLanguage as Language);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem('selectedLanguage', lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key: string): string => {
    const langTranslations = translations[language];
    return langTranslations[key as keyof typeof langTranslations] || key;
  };

  return (
    <LocalizationContext.Provider value={{ language, currentLanguage: language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
}