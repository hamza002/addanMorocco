/**
 * World cities grouped by country.
 * Each country includes an Aladhan calculation method (https://api.aladhan.com/v1/methods).
 * Method -1 means use the generic "Muslim World League" (3) as fallback.
 */

export interface WorldCity {
  name: string;
  nameAr?: string;
  lat: number;
  lng: number;
}

export interface Country {
  code: string;       // ISO 3166-1 alpha-2
  nameEn: string;
  nameFr: string;
  nameAr: string;
  method: number;     // Aladhan calculation method
  cities: WorldCity[];
}

// Aladhan methods reference:
// 1  – University of Islamic Sciences, Karachi
// 2  – Islamic Society of North America (ISNA)
// 3  – Muslim World League
// 4  – Umm Al-Qura University, Makkah
// 5  – Egyptian General Authority of Survey
// 7  – Institute of Geophysics, Univ. Tehran
// 8  – Gulf Region
// 9  – Kuwait
// 10 – Qatar
// 11 – Singapore (MUIS)
// 12 – Union Organisation Islamic de France
// 13 – Diyanet İşleri Başkanlığı, Turkey
// 14 – Spiritual Administration of Muslims of Russia
// 16 – Dubai
// 17 – JAKIM Malaysia
// 18 – Tunisia
// 19 – Algeria
// 20 – KEMENAG Indonesia
// 21 – Morocco
// 22 – Comunidade Islamica de Lisboa (Portugal)
// 23 – Jordan (Ministry of Awqaf)

export const COUNTRIES: Country[] = [
  {
    code: 'MA', nameEn: 'Morocco', nameFr: 'Maroc', nameAr: 'المغرب', method: 21,
    cities: [
      {name: 'Casablanca', nameAr: 'الدار البيضاء', lat: 33.5731, lng: -7.5898},
      {name: 'Rabat', nameAr: 'الرباط', lat: 34.0209, lng: -6.8416},
      {name: 'Marrakech', nameAr: 'مراكش', lat: 31.6295, lng: -7.9811},
      {name: 'Fès', nameAr: 'فاس', lat: 34.0181, lng: -5.0078},
      {name: 'Tanger', nameAr: 'طنجة', lat: 35.7595, lng: -5.8340},
      {name: 'Agadir', nameAr: 'أكادير', lat: 30.4278, lng: -9.5981},
      {name: 'Oujda', nameAr: 'وجدة', lat: 34.6814, lng: -1.9086},
      {name: 'Meknès', nameAr: 'مكناس', lat: 33.8935, lng: -5.5473},
      {name: 'Tétouan', nameAr: 'تطوان', lat: 35.5889, lng: -5.3626},
      {name: 'Salé', nameAr: 'سلا', lat: 34.0531, lng: -6.7985},
      {name: 'Kénitra', nameAr: 'القنيطرة', lat: 34.2610, lng: -6.5802},
      {name: 'El Jadida', nameAr: 'الجديدة', lat: 33.2549, lng: -8.5078},
      {name: 'Nador', nameAr: 'الناظور', lat: 35.1740, lng: -2.9287},
      {name: 'Beni Mellal', nameAr: 'بني ملال', lat: 32.3373, lng: -6.3498},
      {name: 'Taza', nameAr: 'تازة', lat: 34.2100, lng: -4.0100},
      {name: 'Chefchaouen', nameAr: 'شفشاون', lat: 35.1688, lng: -5.2636},
      {name: 'Essaouira', nameAr: 'الصويرة', lat: 31.5085, lng: -9.7595},
      {name: 'Ouarzazate', nameAr: 'ورزازات', lat: 30.9189, lng: -6.8934},
      {name: 'Laâyoune', nameAr: 'العيون', lat: 27.1253, lng: -13.1625},
      {name: 'Dakhla', nameAr: 'الداخلة', lat: 23.6848, lng: -15.9573},
      {name: 'Errachidia', nameAr: 'الراشيدية', lat: 31.9314, lng: -4.4243},
      {name: 'Al Hoceïma', nameAr: 'الحسيمة', lat: 35.2517, lng: -3.9372},
      {name: 'Ifrane', nameAr: 'إفران', lat: 33.5228, lng: -5.1119},
      {name: 'Settat', nameAr: 'سطات', lat: 33.0011, lng: -7.6165},
      {name: 'Guelmim', nameAr: 'كلميم', lat: 28.9870, lng: -10.0574},
      {name: 'Safi', nameAr: 'آسفي', lat: 32.3008, lng: -9.2281},
      {name: 'Khouribga', nameAr: 'خريبكة', lat: 32.8813, lng: -6.9063},
      {name: 'Taroudant', nameAr: 'تارودانت', lat: 30.4703, lng: -8.8773},
      {name: 'Tiznit', nameAr: 'تيزنيت', lat: 29.6974, lng: -9.7316},
      {name: 'Mohammedia', nameAr: 'المحمدية', lat: 33.6861, lng: -7.3833},
    ],
  },
  {
    code: 'SA', nameEn: 'Saudi Arabia', nameFr: 'Arabie Saoudite', nameAr: 'المملكة العربية السعودية', method: 4,
    cities: [
      {name: 'Makkah', nameAr: 'مكة المكرمة', lat: 21.3891, lng: 39.8579},
      {name: 'Madinah', nameAr: 'المدينة المنورة', lat: 24.5247, lng: 39.5692},
      {name: 'Riyadh', nameAr: 'الرياض', lat: 24.6877, lng: 46.7219},
      {name: 'Jeddah', nameAr: 'جدة', lat: 21.5433, lng: 39.1728},
      {name: 'Dammam', nameAr: 'الدمام', lat: 26.4207, lng: 50.0888},
      {name: 'Taif', nameAr: 'الطائف', lat: 21.2702, lng: 40.4158},
      {name: 'Tabuk', nameAr: 'تبوك', lat: 28.3835, lng: 36.5662},
      {name: 'Abha', nameAr: 'أبها', lat: 18.2165, lng: 42.5053},
      {name: 'Khobar', nameAr: 'الخبر', lat: 26.2163, lng: 50.1982},
      {name: 'Qatif', nameAr: 'القطيف', lat: 26.5161, lng: 50.0106},
    ],
  },
  {
    code: 'AE', nameEn: 'UAE', nameFr: 'Émirats Arabes Unis', nameAr: 'الإمارات العربية المتحدة', method: 16,
    cities: [
      {name: 'Dubai', nameAr: 'دبي', lat: 25.2048, lng: 55.2708},
      {name: 'Abu Dhabi', nameAr: 'أبو ظبي', lat: 24.4539, lng: 54.3773},
      {name: 'Sharjah', nameAr: 'الشارقة', lat: 25.3461, lng: 55.4209},
      {name: 'Ajman', nameAr: 'عجمان', lat: 25.4052, lng: 55.5136},
      {name: 'Al Ain', nameAr: 'العين', lat: 24.2075, lng: 55.7447},
      {name: 'Ras Al Khaimah', nameAr: 'رأس الخيمة', lat: 25.7895, lng: 55.9432},
    ],
  },
  {
    code: 'EG', nameEn: 'Egypt', nameFr: 'Égypte', nameAr: 'مصر', method: 5,
    cities: [
      {name: 'Cairo', nameAr: 'القاهرة', lat: 30.0444, lng: 31.2357},
      {name: 'Alexandria', nameAr: 'الإسكندرية', lat: 31.2001, lng: 29.9187},
      {name: 'Giza', nameAr: 'الجيزة', lat: 30.0131, lng: 31.2089},
      {name: 'Sharm El-Sheikh', nameAr: 'شرم الشيخ', lat: 27.9158, lng: 34.3300},
      {name: 'Luxor', nameAr: 'الأقصر', lat: 25.6872, lng: 32.6396},
      {name: 'Aswan', nameAr: 'أسوان', lat: 24.0889, lng: 32.8998},
      {name: 'Hurghada', nameAr: 'الغردقة', lat: 27.2579, lng: 33.8116},
      {name: 'Port Said', nameAr: 'بور سعيد', lat: 31.2565, lng: 32.2841},
      {name: 'Suez', nameAr: 'السويس', lat: 29.9668, lng: 32.5498},
      {name: 'Mansoura', nameAr: 'المنصورة', lat: 31.0409, lng: 31.3785},
    ],
  },
  {
    code: 'TR', nameEn: 'Turkey', nameFr: 'Turquie', nameAr: 'تركيا', method: 13,
    cities: [
      {name: 'Istanbul', nameAr: 'إسطنبول', lat: 41.0082, lng: 28.9784},
      {name: 'Ankara', nameAr: 'أنقرة', lat: 39.9334, lng: 32.8597},
      {name: 'Izmir', nameAr: 'إزمير', lat: 38.4192, lng: 27.1287},
      {name: 'Bursa', nameAr: 'بورصة', lat: 40.1885, lng: 29.0610},
      {name: 'Antalya', nameAr: 'أنطاليا', lat: 36.8841, lng: 30.7056},
      {name: 'Konya', nameAr: 'قونية', lat: 37.8746, lng: 32.4932},
      {name: 'Gaziantep', nameAr: 'غازي عنتاب', lat: 37.0662, lng: 37.3833},
      {name: 'Adana', nameAr: 'أضنة', lat: 37.0000, lng: 35.3213},
      {name: 'Trabzon', nameAr: 'طرابزون', lat: 41.0015, lng: 39.7178},
    ],
  },
  {
    code: 'ID', nameEn: 'Indonesia', nameFr: 'Indonésie', nameAr: 'إندونيسيا', method: 20,
    cities: [
      {name: 'Jakarta', nameAr: 'جاكرتا', lat: -6.2088, lng: 106.8456},
      {name: 'Surabaya', nameAr: 'سورابايا', lat: -7.2575, lng: 112.7521},
      {name: 'Bandung', nameAr: 'باندونغ', lat: -6.9175, lng: 107.6191},
      {name: 'Medan', nameAr: 'ميدان', lat: 3.5952, lng: 98.6722},
      {name: 'Semarang', nameAr: 'سيمارانغ', lat: -6.9666, lng: 110.4162},
      {name: 'Makassar', nameAr: 'ماكاسار', lat: -5.1477, lng: 119.4327},
      {name: 'Yogyakarta', nameAr: 'يوغياكارتا', lat: -7.7956, lng: 110.3695},
      {name: 'Palembang', nameAr: 'باليمبانغ', lat: -2.9761, lng: 104.7754},
      {name: 'Aceh', nameAr: 'آتشيه', lat: 5.5483, lng: 95.3238},
      {name: 'Bali', nameAr: 'بالي', lat: -8.4095, lng: 115.1889},
    ],
  },
  {
    code: 'PK', nameEn: 'Pakistan', nameFr: 'Pakistan', nameAr: 'باكستان', method: 1,
    cities: [
      {name: 'Karachi', nameAr: 'كراتشي', lat: 24.8607, lng: 67.0011},
      {name: 'Lahore', nameAr: 'لاهور', lat: 31.5204, lng: 74.3587},
      {name: 'Islamabad', nameAr: 'إسلام آباد', lat: 33.6844, lng: 73.0479},
      {name: 'Rawalpindi', nameAr: 'راوالبندي', lat: 33.5651, lng: 73.0169},
      {name: 'Peshawar', nameAr: 'بيشاور', lat: 34.0151, lng: 71.5249},
      {name: 'Quetta', nameAr: 'كويتا', lat: 30.1798, lng: 66.9750},
      {name: 'Multan', nameAr: 'ملتان', lat: 30.1575, lng: 71.5249},
      {name: 'Faisalabad', nameAr: 'فيصل آباد', lat: 31.4504, lng: 73.1350},
    ],
  },
  {
    code: 'MY', nameEn: 'Malaysia', nameFr: 'Malaisie', nameAr: 'ماليزيا', method: 17,
    cities: [
      {name: 'Kuala Lumpur', nameAr: 'كوالا لمبور', lat: 3.1390, lng: 101.6869},
      {name: 'Johor Bahru', nameAr: 'جوهور بهرو', lat: 1.4927, lng: 103.7414},
      {name: 'Penang', nameAr: 'بينانغ', lat: 5.4141, lng: 100.3288},
      {name: 'Kota Kinabalu', nameAr: 'كوتا كينابالو', lat: 5.9804, lng: 116.0735},
      {name: 'Kuching', nameAr: 'كوتشينغ', lat: 1.5535, lng: 110.3593},
      {name: 'Shah Alam', nameAr: 'شاه عالم', lat: 3.0738, lng: 101.5183},
      {name: 'Petaling Jaya', nameAr: 'بيتالينغ جايا', lat: 3.1073, lng: 101.6067},
    ],
  },
  {
    code: 'DZ', nameEn: 'Algeria', nameFr: 'Algérie', nameAr: 'الجزائر', method: 19,
    cities: [
      {name: 'Alger', nameAr: 'الجزائر العاصمة', lat: 36.7538, lng: 3.0588},
      {name: 'Oran', nameAr: 'وهران', lat: 35.6969, lng: -0.6331},
      {name: 'Constantine', nameAr: 'قسنطينة', lat: 36.3650, lng: 6.6147},
      {name: 'Annaba', nameAr: 'عنابة', lat: 36.8979, lng: 7.7650},
      {name: 'Batna', nameAr: 'باتنة', lat: 35.5559, lng: 6.1742},
      {name: 'Sétif', nameAr: 'سطيف', lat: 36.1898, lng: 5.4108},
      {name: 'Tlemcen', nameAr: 'تلمسان', lat: 34.8828, lng: -1.3167},
      {name: 'Blida', nameAr: 'البليدة', lat: 36.4700, lng: 2.8300},
      {name: 'Bejaia', nameAr: 'بجاية', lat: 36.7522, lng: 5.0564},
      {name: 'Tizi Ouzou', nameAr: 'تيزي وزو', lat: 36.7169, lng: 4.0497},
    ],
  },
  {
    code: 'TN', nameEn: 'Tunisia', nameFr: 'Tunisie', nameAr: 'تونس', method: 18,
    cities: [
      {name: 'Tunis', nameAr: 'تونس العاصمة', lat: 36.8190, lng: 10.1658},
      {name: 'Sfax', nameAr: 'صفاقس', lat: 34.7398, lng: 10.7600},
      {name: 'Sousse', nameAr: 'سوسة', lat: 35.8256, lng: 10.6369},
      {name: 'Kairouan', nameAr: 'القيروان', lat: 35.6781, lng: 10.0997},
      {name: 'Bizerte', nameAr: 'بنزرت', lat: 37.2744, lng: 9.8739},
      {name: 'Gabès', nameAr: 'قابس', lat: 33.8819, lng: 10.0982},
      {name: 'Monastir', nameAr: 'المنستير', lat: 35.7643, lng: 10.8113},
      {name: 'Nabeul', nameAr: 'نابل', lat: 36.4561, lng: 10.7376},
    ],
  },
  {
    code: 'LY', nameEn: 'Libya', nameFr: 'Libye', nameAr: 'ليبيا', method: 3,
    cities: [
      {name: 'Tripoli', nameAr: 'طرابلس', lat: 32.9033, lng: 13.1800},
      {name: 'Benghazi', nameAr: 'بنغازي', lat: 32.1150, lng: 20.0670},
      {name: 'Misrata', nameAr: 'مصراتة', lat: 32.3754, lng: 15.0925},
      {name: 'Tobruk', nameAr: 'طبرق', lat: 32.0874, lng: 23.9639},
    ],
  },
  {
    code: 'SD', nameEn: 'Sudan', nameFr: 'Soudan', nameAr: 'السودان', method: 3,
    cities: [
      {name: 'Khartoum', nameAr: 'الخرطوم', lat: 15.5007, lng: 32.5599},
      {name: 'Omdurman', nameAr: 'أم درمان', lat: 15.6445, lng: 32.4777},
      {name: 'Port Sudan', nameAr: 'بورتسودان', lat: 19.6158, lng: 37.2164},
      {name: 'Kassala', nameAr: 'كسلا', lat: 15.4561, lng: 36.4003},
    ],
  },
  {
    code: 'IQ', nameEn: 'Iraq', nameFr: 'Irak', nameAr: 'العراق', method: 3,
    cities: [
      {name: 'Baghdad', nameAr: 'بغداد', lat: 33.3152, lng: 44.3661},
      {name: 'Basra', nameAr: 'البصرة', lat: 30.5085, lng: 47.7804},
      {name: 'Mosul', nameAr: 'الموصل', lat: 36.3350, lng: 43.1189},
      {name: 'Erbil', nameAr: 'أربيل', lat: 36.1901, lng: 44.0091},
      {name: 'Najaf', nameAr: 'النجف', lat: 32.0003, lng: 44.3356},
      {name: 'Karbala', nameAr: 'كربلاء', lat: 32.6136, lng: 44.0245},
    ],
  },
  {
    code: 'SY', nameEn: 'Syria', nameFr: 'Syrie', nameAr: 'سوريا', method: 3,
    cities: [
      {name: 'Damascus', nameAr: 'دمشق', lat: 33.5138, lng: 36.2765},
      {name: 'Aleppo', nameAr: 'حلب', lat: 36.2021, lng: 37.1343},
      {name: 'Homs', nameAr: 'حمص', lat: 34.7324, lng: 36.7137},
      {name: 'Hama', nameAr: 'حماة', lat: 35.1318, lng: 36.7550},
      {name: 'Latakia', nameAr: 'اللاذقية', lat: 35.5317, lng: 35.7914},
    ],
  },
  {
    code: 'JO', nameEn: 'Jordan', nameFr: 'Jordanie', nameAr: 'الأردن', method: 23,
    cities: [
      {name: 'Amman', nameAr: 'عمّان', lat: 31.9539, lng: 35.9106},
      {name: 'Zarqa', nameAr: 'الزرقاء', lat: 32.0728, lng: 36.0878},
      {name: 'Irbid', nameAr: 'إربد', lat: 32.5556, lng: 35.8500},
      {name: 'Aqaba', nameAr: 'العقبة', lat: 29.5321, lng: 35.0063},
    ],
  },
  {
    code: 'LB', nameEn: 'Lebanon', nameFr: 'Liban', nameAr: 'لبنان', method: 3,
    cities: [
      {name: 'Beirut', nameAr: 'بيروت', lat: 33.8938, lng: 35.5018},
      {name: 'Tripoli', nameAr: 'طرابلس', lat: 34.4367, lng: 35.8497},
      {name: 'Sidon', nameAr: 'صيدا', lat: 33.5606, lng: 35.3714},
      {name: 'Tyre', nameAr: 'صور', lat: 33.2705, lng: 35.2038},
    ],
  },
  {
    code: 'KW', nameEn: 'Kuwait', nameFr: 'Koweït', nameAr: 'الكويت', method: 9,
    cities: [
      {name: 'Kuwait City', nameAr: 'مدينة الكويت', lat: 29.3759, lng: 47.9774},
      {name: 'Hawalli', nameAr: 'حولي', lat: 29.3325, lng: 48.0313},
      {name: 'Salmiya', nameAr: 'السالمية', lat: 29.3370, lng: 48.0748},
    ],
  },
  {
    code: 'QA', nameEn: 'Qatar', nameFr: 'Qatar', nameAr: 'قطر', method: 10,
    cities: [
      {name: 'Doha', nameAr: 'الدوحة', lat: 25.2854, lng: 51.5310},
      {name: 'Al Wakrah', nameAr: 'الوكرة', lat: 25.1635, lng: 51.6020},
      {name: 'Al Khor', nameAr: 'الخور', lat: 25.6834, lng: 51.4973},
    ],
  },
  {
    code: 'BH', nameEn: 'Bahrain', nameFr: 'Bahreïn', nameAr: 'البحرين', method: 8,
    cities: [
      {name: 'Manama', nameAr: 'المنامة', lat: 26.2235, lng: 50.5876},
      {name: 'Muharraq', nameAr: 'المحرق', lat: 26.2497, lng: 50.6127},
      {name: 'Riffa', nameAr: 'الرفاع', lat: 26.1295, lng: 50.5553},
    ],
  },
  {
    code: 'OM', nameEn: 'Oman', nameFr: 'Oman', nameAr: 'عُمان', method: 8,
    cities: [
      {name: 'Muscat', nameAr: 'مسقط', lat: 23.5880, lng: 58.3829},
      {name: 'Salalah', nameAr: 'صلالة', lat: 17.0151, lng: 54.0924},
      {name: 'Nizwa', nameAr: 'نزوى', lat: 22.9333, lng: 57.5333},
      {name: 'Sohar', nameAr: 'صحار', lat: 24.3476, lng: 56.7460},
    ],
  },
  {
    code: 'YE', nameEn: 'Yemen', nameFr: 'Yémen', nameAr: 'اليمن', method: 3,
    cities: [
      {name: "Sana'a", nameAr: 'صنعاء', lat: 15.3694, lng: 44.1910},
      {name: 'Aden', nameAr: 'عدن', lat: 12.7794, lng: 45.0367},
      {name: 'Taiz', nameAr: 'تعز', lat: 13.5789, lng: 44.0209},
      {name: 'Hodeidah', nameAr: 'الحديدة', lat: 14.7980, lng: 42.9511},
    ],
  },
  {
    code: 'IR', nameEn: 'Iran', nameFr: 'Iran', nameAr: 'إيران', method: 7,
    cities: [
      {name: 'Tehran', nameAr: 'طهران', lat: 35.6892, lng: 51.3890},
      {name: 'Mashhad', nameAr: 'مشهد', lat: 36.2605, lng: 59.6168},
      {name: 'Isfahan', nameAr: 'أصفهان', lat: 32.6546, lng: 51.6680},
      {name: 'Shiraz', nameAr: 'شيراز', lat: 29.5918, lng: 52.5837},
      {name: 'Tabriz', nameAr: 'تبريز', lat: 38.0800, lng: 46.2919},
      {name: 'Qom', nameAr: 'قم', lat: 34.6401, lng: 50.8764},
    ],
  },
  {
    code: 'FR', nameEn: 'France', nameFr: 'France', nameAr: 'فرنسا', method: 12,
    cities: [
      {name: 'Paris', nameAr: 'باريس', lat: 48.8566, lng: 2.3522},
      {name: 'Marseille', nameAr: 'مرسيليا', lat: 43.2965, lng: 5.3698},
      {name: 'Lyon', nameAr: 'ليون', lat: 45.7640, lng: 4.8357},
      {name: 'Toulouse', nameAr: 'تولوز', lat: 43.6047, lng: 1.4442},
      {name: 'Nice', nameAr: 'نيس', lat: 43.7102, lng: 7.2620},
      {name: 'Nantes', nameAr: 'نانت', lat: 47.2184, lng: -1.5536},
      {name: 'Strasbourg', nameAr: 'ستراسبورغ', lat: 48.5734, lng: 7.7521},
      {name: 'Bordeaux', nameAr: 'بوردو', lat: 44.8378, lng: -0.5792},
      {name: 'Lille', nameAr: 'ليل', lat: 50.6292, lng: 3.0573},
      {name: 'Grenoble', nameAr: 'غرونوبل', lat: 45.1885, lng: 5.7245},
    ],
  },
  {
    code: 'BE', nameEn: 'Belgium', nameFr: 'Belgique', nameAr: 'بلجيكا', method: 3,
    cities: [
      {name: 'Brussels', nameAr: 'بروكسل', lat: 50.8503, lng: 4.3517},
      {name: 'Antwerp', nameAr: 'أنتويرب', lat: 51.2194, lng: 4.4025},
      {name: 'Ghent', nameAr: 'غنت', lat: 51.0543, lng: 3.7174},
      {name: 'Liège', nameAr: 'لييج', lat: 50.6326, lng: 5.5797},
    ],
  },
  {
    code: 'NL', nameEn: 'Netherlands', nameFr: 'Pays-Bas', nameAr: 'هولندا', method: 3,
    cities: [
      {name: 'Amsterdam', nameAr: 'أمستردام', lat: 52.3676, lng: 4.9041},
      {name: 'Rotterdam', nameAr: 'روتردام', lat: 51.9244, lng: 4.4777},
      {name: 'The Hague', nameAr: 'لاهاي', lat: 52.0705, lng: 4.3007},
      {name: 'Utrecht', nameAr: 'أوتريخت', lat: 52.0907, lng: 5.1214},
    ],
  },
  {
    code: 'DE', nameEn: 'Germany', nameFr: 'Allemagne', nameAr: 'ألمانيا', method: 3,
    cities: [
      {name: 'Berlin', nameAr: 'برلين', lat: 52.5200, lng: 13.4050},
      {name: 'Hamburg', nameAr: 'هامبورغ', lat: 53.5511, lng: 9.9937},
      {name: 'Munich', nameAr: 'ميونيخ', lat: 48.1351, lng: 11.5820},
      {name: 'Cologne', nameAr: 'كولونيا', lat: 50.9333, lng: 6.9500},
      {name: 'Frankfurt', nameAr: 'فرانكفورت', lat: 50.1109, lng: 8.6821},
      {name: 'Stuttgart', nameAr: 'شتوتغارت', lat: 48.7758, lng: 9.1829},
      {name: 'Duisburg', nameAr: 'دويسبورغ', lat: 51.4344, lng: 6.7623},
    ],
  },
  {
    code: 'GB', nameEn: 'United Kingdom', nameFr: 'Royaume-Uni', nameAr: 'المملكة المتحدة', method: 15,
    cities: [
      {name: 'London', nameAr: 'لندن', lat: 51.5074, lng: -0.1278},
      {name: 'Birmingham', nameAr: 'برمنغهام', lat: 52.4862, lng: -1.8904},
      {name: 'Manchester', nameAr: 'مانشستر', lat: 53.4808, lng: -2.2426},
      {name: 'Leeds', nameAr: 'ليدز', lat: 53.8008, lng: -1.5491},
      {name: 'Bradford', nameAr: 'برادفورد', lat: 53.7960, lng: -1.7594},
      {name: 'Glasgow', nameAr: 'غلاسكو', lat: 55.8642, lng: -4.2518},
      {name: 'Leicester', nameAr: 'ليستر', lat: 52.6369, lng: -1.1398},
      {name: 'Luton', nameAr: 'لوتون', lat: 51.8787, lng: -0.4200},
    ],
  },
  {
    code: 'ES', nameEn: 'Spain', nameFr: 'Espagne', nameAr: 'إسبانيا', method: 3,
    cities: [
      {name: 'Madrid', nameAr: 'مدريد', lat: 40.4168, lng: -3.7038},
      {name: 'Barcelona', nameAr: 'برشلونة', lat: 41.3851, lng: 2.1734},
      {name: 'Valencia', nameAr: 'بلنسية', lat: 39.4699, lng: -0.3763},
      {name: 'Seville', nameAr: 'إشبيلية', lat: 37.3891, lng: -5.9845},
      {name: 'Málaga', nameAr: 'مالقة', lat: 36.7213, lng: -4.4213},
      {name: 'Ceuta', nameAr: 'سبتة', lat: 35.8894, lng: -5.3198},
      {name: 'Melilla', nameAr: 'مليلية', lat: 35.2923, lng: -2.9381},
    ],
  },
  {
    code: 'IT', nameEn: 'Italy', nameFr: 'Italie', nameAr: 'إيطاليا', method: 3,
    cities: [
      {name: 'Rome', nameAr: 'روما', lat: 41.9028, lng: 12.4964},
      {name: 'Milan', nameAr: 'ميلانو', lat: 45.4642, lng: 9.1900},
      {name: 'Naples', nameAr: 'نابولي', lat: 40.8518, lng: 14.2681},
      {name: 'Turin', nameAr: 'تورينو', lat: 45.0703, lng: 7.6869},
    ],
  },
  {
    code: 'US', nameEn: 'United States', nameFr: 'États-Unis', nameAr: 'الولايات المتحدة', method: 2,
    cities: [
      {name: 'New York', nameAr: 'نيويورك', lat: 40.7128, lng: -74.0060},
      {name: 'Los Angeles', nameAr: 'لوس أنجلوس', lat: 34.0522, lng: -118.2437},
      {name: 'Chicago', nameAr: 'شيكاغو', lat: 41.8781, lng: -87.6298},
      {name: 'Houston', nameAr: 'هيوستن', lat: 29.7604, lng: -95.3698},
      {name: 'Phoenix', nameAr: 'فينيكس', lat: 33.4484, lng: -112.0740},
      {name: 'Philadelphia', nameAr: 'فيلادلفيا', lat: 39.9526, lng: -75.1652},
      {name: 'San Antonio', nameAr: 'سان أنتونيو', lat: 29.4241, lng: -98.4936},
      {name: 'Detroit', nameAr: 'ديترويت', lat: 42.3314, lng: -83.0458},
      {name: 'Dearborn', nameAr: 'ديربورن', lat: 42.3223, lng: -83.1763},
      {name: 'Washington DC', nameAr: 'واشنطن العاصمة', lat: 38.9072, lng: -77.0369},
    ],
  },
  {
    code: 'CA', nameEn: 'Canada', nameFr: 'Canada', nameAr: 'كندا', method: 2,
    cities: [
      {name: 'Toronto', nameAr: 'تورونتو', lat: 43.6532, lng: -79.3832},
      {name: 'Montreal', nameAr: 'مونتريال', lat: 45.5017, lng: -73.5673},
      {name: 'Vancouver', nameAr: 'فانكوفر', lat: 49.2827, lng: -123.1207},
      {name: 'Calgary', nameAr: 'كالغاري', lat: 51.0447, lng: -114.0719},
      {name: 'Ottawa', nameAr: 'أوتاوا', lat: 45.4215, lng: -75.6972},
      {name: 'Edmonton', nameAr: 'إدمونتون', lat: 53.5461, lng: -113.4938},
    ],
  },
  {
    code: 'AU', nameEn: 'Australia', nameFr: 'Australie', nameAr: 'أستراليا', method: 3,
    cities: [
      {name: 'Sydney', nameAr: 'سيدني', lat: -33.8688, lng: 151.2093},
      {name: 'Melbourne', nameAr: 'ملبورن', lat: -37.8136, lng: 144.9631},
      {name: 'Brisbane', nameAr: 'بريزبن', lat: -27.4698, lng: 153.0251},
      {name: 'Perth', nameAr: 'بيرث', lat: -31.9505, lng: 115.8605},
      {name: 'Adelaide', nameAr: 'أديلايد', lat: -34.9285, lng: 138.6007},
    ],
  },
  {
    code: 'ZA', nameEn: 'South Africa', nameFr: 'Afrique du Sud', nameAr: 'جنوب أفريقيا', method: 3,
    cities: [
      {name: 'Johannesburg', nameAr: 'جوهانسبورغ', lat: -26.2041, lng: 28.0473},
      {name: 'Cape Town', nameAr: 'كيب تاون', lat: -33.9249, lng: 18.4241},
      {name: 'Durban', nameAr: 'ديربان', lat: -29.8587, lng: 31.0218},
      {name: 'Pretoria', nameAr: 'بريتوريا', lat: -25.7479, lng: 28.2293},
    ],
  },
  {
    code: 'RU', nameEn: 'Russia', nameFr: 'Russie', nameAr: 'روسيا', method: 14,
    cities: [
      {name: 'Moscow', nameAr: 'موسكو', lat: 55.7558, lng: 37.6173},
      {name: "Kazan'", nameAr: 'قازان', lat: 55.7887, lng: 49.1221},
      {name: 'Ufa', nameAr: 'أوفا', lat: 54.7388, lng: 55.9721},
      {name: 'Grozny', nameAr: 'غروزني', lat: 43.3172, lng: 45.6988},
      {name: 'Makhachkala', nameAr: 'مخاتشقلعة', lat: 42.9849, lng: 47.5047},
      {name: 'Saint Petersburg', nameAr: 'سان بطرسبرغ', lat: 59.9311, lng: 30.3609},
    ],
  },
  {
    code: 'SG', nameEn: 'Singapore', nameFr: 'Singapour', nameAr: 'سنغافورة', method: 11,
    cities: [
      {name: 'Singapore', nameAr: 'سنغافورة', lat: 1.3521, lng: 103.8198},
    ],
  },
  {
    code: 'IN', nameEn: 'India', nameFr: 'Inde', nameAr: 'الهند', method: 1,
    cities: [
      {name: 'Mumbai', nameAr: 'مومباي', lat: 19.0760, lng: 72.8777},
      {name: 'Delhi', nameAr: 'دلهي', lat: 28.6139, lng: 77.2090},
      {name: 'Hyderabad', nameAr: 'حيدر آباد', lat: 17.3850, lng: 78.4867},
      {name: 'Lucknow', nameAr: 'لكنو', lat: 26.8467, lng: 80.9462},
      {name: 'Bangalore', nameAr: 'بنغالور', lat: 12.9716, lng: 77.5946},
      {name: 'Chennai', nameAr: 'تشيناي', lat: 13.0827, lng: 80.2707},
      {name: 'Kolkata', nameAr: 'كلكتا', lat: 22.5726, lng: 88.3639},
      {name: 'Bhopal', nameAr: 'بوبال', lat: 23.2599, lng: 77.4126},
      {name: 'Srinagar', nameAr: 'سريناغار', lat: 34.0837, lng: 74.7973},
    ],
  },
  {
    code: 'BD', nameEn: 'Bangladesh', nameFr: 'Bangladesh', nameAr: 'بنغلاديش', method: 1,
    cities: [
      {name: 'Dhaka', nameAr: 'دكا', lat: 23.8103, lng: 90.4125},
      {name: 'Chittagong', nameAr: 'شيتاغونغ', lat: 22.3569, lng: 91.7832},
      {name: 'Sylhet', nameAr: 'سيلهيت', lat: 24.8949, lng: 91.8687},
      {name: 'Rajshahi', nameAr: 'راجشاهي', lat: 24.3636, lng: 88.6241},
    ],
  },
  {
    code: 'PS', nameEn: 'Palestine', nameFr: 'Palestine', nameAr: 'فلسطين', method: 3,
    cities: [
      {name: 'Jerusalem', nameAr: 'القدس', lat: 31.7683, lng: 35.2137},
      {name: 'Gaza', nameAr: 'غزة', lat: 31.5017, lng: 34.4674},
      {name: 'Ramallah', nameAr: 'رام الله', lat: 31.9022, lng: 35.2097},
      {name: 'Hebron', nameAr: 'الخليل', lat: 31.5326, lng: 35.0998},
      {name: 'Nablus', nameAr: 'نابلس', lat: 32.2228, lng: 35.2543},
    ],
  },
  {
    code: 'SE', nameEn: 'Sweden', nameFr: 'Suède', nameAr: 'السويد', method: 3,
    cities: [
      {name: 'Stockholm', nameAr: 'ستوكهولم', lat: 59.3293, lng: 18.0686},
      {name: 'Malmö', nameAr: 'مالمو', lat: 55.6050, lng: 13.0038},
      {name: 'Gothenburg', nameAr: 'غوتنبرغ', lat: 57.7089, lng: 11.9746},
    ],
  },
  {
    code: 'NO', nameEn: 'Norway', nameFr: 'Norvège', nameAr: 'النرويج', method: 3,
    cities: [
      {name: 'Oslo', nameAr: 'أوسلو', lat: 59.9139, lng: 10.7522},
      {name: 'Bergen', nameAr: 'برغن', lat: 60.3928, lng: 5.3221},
    ],
  },
  {
    code: 'DK', nameEn: 'Denmark', nameFr: 'Danemark', nameAr: 'الدنمارك', method: 3,
    cities: [
      {name: 'Copenhagen', nameAr: 'كوبنهاغن', lat: 55.6761, lng: 12.5683},
      {name: 'Aarhus', nameAr: 'أرهوس', lat: 56.1629, lng: 10.2039},
    ],
  },
  {
    code: 'CH', nameEn: 'Switzerland', nameFr: 'Suisse', nameAr: 'سويسرا', method: 3,
    cities: [
      {name: 'Zurich', nameAr: 'زيورخ', lat: 47.3769, lng: 8.5417},
      {name: 'Geneva', nameAr: 'جنيف', lat: 46.2044, lng: 6.1432},
      {name: 'Basel', nameAr: 'بازل', lat: 47.5596, lng: 7.5886},
    ],
  },
  {
    code: 'PT', nameEn: 'Portugal', nameFr: 'Portugal', nameAr: 'البرتغال', method: 22,
    cities: [
      {name: 'Lisbon', nameAr: 'لشبونة', lat: 38.7169, lng: -9.1399},
      {name: 'Porto', nameAr: 'بورتو', lat: 41.1579, lng: -8.6291},
    ],
  },
  {
    code: 'NG', nameEn: 'Nigeria', nameFr: 'Nigéria', nameAr: 'نيجيريا', method: 3,
    cities: [
      {name: 'Lagos', nameAr: 'لاغوس', lat: 6.5244, lng: 3.3792},
      {name: 'Kano', nameAr: 'كانو', lat: 12.0022, lng: 8.5920},
      {name: 'Abuja', nameAr: 'أبوجا', lat: 9.0765, lng: 7.3986},
      {name: 'Kaduna', nameAr: 'كادونا', lat: 10.5105, lng: 7.4165},
      {name: 'Sokoto', nameAr: 'سوكوتو', lat: 13.0535, lng: 5.2324},
    ],
  },
  {
    code: 'SN', nameEn: 'Senegal', nameFr: 'Sénégal', nameAr: 'السنغال', method: 3,
    cities: [
      {name: 'Dakar', nameAr: 'داكار', lat: 14.7167, lng: -17.4677},
      {name: 'Touba', nameAr: 'طوبا', lat: 14.8506, lng: -15.8831},
      {name: 'Thiès', nameAr: 'تييس', lat: 14.7886, lng: -16.9261},
    ],
  },
  {code: 'AZ', nameEn: 'Azerbaijan', nameFr: 'Azerbaïdjan', nameAr: 'أذربيجان', method: 3,
    cities: [{name: 'Baku', nameAr: 'باكو', lat: 40.4093, lng: 49.8671}, {name: 'Ganja', nameAr: 'غانجا', lat: 40.6825, lng: 46.3606}]},
  {code: 'KZ', nameEn: 'Kazakhstan', nameFr: 'Kazakhstan', nameAr: 'كازاخستان', method: 3,
    cities: [{name: 'Almaty', nameAr: 'ألماتي', lat: 43.2220, lng: 76.8512}, {name: 'Astana', nameAr: 'أستانا', lat: 51.1801, lng: 71.4460}]},
  {code: 'UZ', nameEn: 'Uzbekistan', nameFr: 'Ouzbékistan', nameAr: 'أوزبكستان', method: 3,
    cities: [{name: 'Tashkent', nameAr: 'طشقند', lat: 41.2995, lng: 69.2401}, {name: 'Samarkand', nameAr: 'سمرقند', lat: 39.6270, lng: 66.9750}]},
  {code: 'AF', nameEn: 'Afghanistan', nameFr: 'Afghanistan', nameAr: 'أفغانستان', method: 1,
    cities: [{name: 'Kabul', nameAr: 'كابول', lat: 34.5553, lng: 69.2075}, {name: 'Kandahar', nameAr: 'قندهار', lat: 31.6289, lng: 65.7372}, {name: 'Herat', nameAr: 'هراة', lat: 34.3482, lng: 62.1998}]},
  {code: 'SO', nameEn: 'Somalia', nameFr: 'Somalie', nameAr: 'الصومال', method: 3,
    cities: [{name: 'Mogadishu', nameAr: 'مقديشو', lat: 2.0469, lng: 45.3182}, {name: 'Hargeisa', nameAr: 'هرجيسا', lat: 9.5600, lng: 44.0650}]},
  {code: 'ET', nameEn: 'Ethiopia', nameFr: 'Éthiopie', nameAr: 'إثيوبيا', method: 3,
    cities: [{name: 'Addis Ababa', nameAr: 'أديس أبابا', lat: 9.0320, lng: 38.7469}, {name: 'Dire Dawa', nameAr: 'دير داوا', lat: 9.6000, lng: 41.8661}]},
];

/** Returns localized country name based on language */
export function getCountryName(country: Country, lang: string): string {
  switch (lang) {
    case 'ar': return country.nameAr;
    case 'fr': return country.nameFr;
    default:   return country.nameEn;
  }
}

/** Find country by ISO code */
export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find(c => c.code === code);
}

/** Get default country (Morocco) */
export const DEFAULT_COUNTRY = COUNTRIES.find(c => c.code === 'MA')!;
