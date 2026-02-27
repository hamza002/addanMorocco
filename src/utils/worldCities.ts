/**
 * World cities grouped by country.
 * Each country includes an Aladhan calculation method (https://api.aladhan.com/v1/methods).
 * Method -1 means use the generic "Muslim World League" (3) as fallback.
 */

export interface WorldCity {
  name: string;
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
      {name: 'Casablanca', lat: 33.5731, lng: -7.5898},
      {name: 'Rabat', lat: 34.0209, lng: -6.8416},
      {name: 'Marrakech', lat: 31.6295, lng: -7.9811},
      {name: 'Fès', lat: 34.0181, lng: -5.0078},
      {name: 'Tanger', lat: 35.7595, lng: -5.8340},
      {name: 'Agadir', lat: 30.4278, lng: -9.5981},
      {name: 'Oujda', lat: 34.6814, lng: -1.9086},
      {name: 'Meknès', lat: 33.8935, lng: -5.5473},
      {name: 'Tétouan', lat: 35.5889, lng: -5.3626},
      {name: 'Salé', lat: 34.0531, lng: -6.7985},
      {name: 'Kénitra', lat: 34.2610, lng: -6.5802},
      {name: 'El Jadida', lat: 33.2549, lng: -8.5078},
      {name: 'Nador', lat: 35.1740, lng: -2.9287},
      {name: 'Beni Mellal', lat: 32.3373, lng: -6.3498},
      {name: 'Taza', lat: 34.2100, lng: -4.0100},
      {name: 'Chefchaouen', lat: 35.1688, lng: -5.2636},
      {name: 'Essaouira', lat: 31.5085, lng: -9.7595},
      {name: 'Ouarzazate', lat: 30.9189, lng: -6.8934},
      {name: 'Laâyoune', lat: 27.1253, lng: -13.1625},
      {name: 'Dakhla', lat: 23.6848, lng: -15.9573},
      {name: 'Errachidia', lat: 31.9314, lng: -4.4243},
      {name: 'Al Hoceïma', lat: 35.2517, lng: -3.9372},
      {name: 'Ifrane', lat: 33.5228, lng: -5.1119},
      {name: 'Settat', lat: 33.0011, lng: -7.6165},
      {name: 'Guelmim', lat: 28.9870, lng: -10.0574},
      {name: 'Safi', lat: 32.3008, lng: -9.2281},
      {name: 'Khouribga', lat: 32.8813, lng: -6.9063},
      {name: 'Taroudant', lat: 30.4703, lng: -8.8773},
      {name: 'Tiznit', lat: 29.6974, lng: -9.7316},
      {name: 'Mohammedia', lat: 33.6861, lng: -7.3833},
    ],
  },
  {
    code: 'SA', nameEn: 'Saudi Arabia', nameFr: 'Arabie Saoudite', nameAr: 'المملكة العربية السعودية', method: 4,
    cities: [
      {name: 'Makkah', lat: 21.3891, lng: 39.8579},
      {name: 'Madinah', lat: 24.5247, lng: 39.5692},
      {name: 'Riyadh', lat: 24.6877, lng: 46.7219},
      {name: 'Jeddah', lat: 21.5433, lng: 39.1728},
      {name: 'Dammam', lat: 26.4207, lng: 50.0888},
      {name: 'Taif', lat: 21.2702, lng: 40.4158},
      {name: 'Tabuk', lat: 28.3835, lng: 36.5662},
      {name: 'Abha', lat: 18.2165, lng: 42.5053},
      {name: 'Khobar', lat: 26.2163, lng: 50.1982},
      {name: 'Qatif', lat: 26.5161, lng: 50.0106},
    ],
  },
  {
    code: 'AE', nameEn: 'UAE', nameFr: 'Émirats Arabes Unis', nameAr: 'الإمارات العربية المتحدة', method: 16,
    cities: [
      {name: 'Dubai', lat: 25.2048, lng: 55.2708},
      {name: 'Abu Dhabi', lat: 24.4539, lng: 54.3773},
      {name: 'Sharjah', lat: 25.3461, lng: 55.4209},
      {name: 'Ajman', lat: 25.4052, lng: 55.5136},
      {name: 'Al Ain', lat: 24.2075, lng: 55.7447},
      {name: 'Ras Al Khaimah', lat: 25.7895, lng: 55.9432},
    ],
  },
  {
    code: 'EG', nameEn: 'Egypt', nameFr: 'Égypte', nameAr: 'مصر', method: 5,
    cities: [
      {name: 'Cairo', lat: 30.0444, lng: 31.2357},
      {name: 'Alexandria', lat: 31.2001, lng: 29.9187},
      {name: 'Giza', lat: 30.0131, lng: 31.2089},
      {name: 'Sharm El-Sheikh', lat: 27.9158, lng: 34.3300},
      {name: 'Luxor', lat: 25.6872, lng: 32.6396},
      {name: 'Aswan', lat: 24.0889, lng: 32.8998},
      {name: 'Hurghada', lat: 27.2579, lng: 33.8116},
      {name: 'Port Said', lat: 31.2565, lng: 32.2841},
      {name: 'Suez', lat: 29.9668, lng: 32.5498},
      {name: 'Mansoura', lat: 31.0409, lng: 31.3785},
    ],
  },
  {
    code: 'TR', nameEn: 'Turkey', nameFr: 'Turquie', nameAr: 'تركيا', method: 13,
    cities: [
      {name: 'Istanbul', lat: 41.0082, lng: 28.9784},
      {name: 'Ankara', lat: 39.9334, lng: 32.8597},
      {name: 'Izmir', lat: 38.4192, lng: 27.1287},
      {name: 'Bursa', lat: 40.1885, lng: 29.0610},
      {name: 'Antalya', lat: 36.8841, lng: 30.7056},
      {name: 'Konya', lat: 37.8746, lng: 32.4932},
      {name: 'Gaziantep', lat: 37.0662, lng: 37.3833},
      {name: 'Adana', lat: 37.0000, lng: 35.3213},
      {name: 'Trabzon', lat: 41.0015, lng: 39.7178},
    ],
  },
  {
    code: 'ID', nameEn: 'Indonesia', nameFr: 'Indonésie', nameAr: 'إندونيسيا', method: 20,
    cities: [
      {name: 'Jakarta', lat: -6.2088, lng: 106.8456},
      {name: 'Surabaya', lat: -7.2575, lng: 112.7521},
      {name: 'Bandung', lat: -6.9175, lng: 107.6191},
      {name: 'Medan', lat: 3.5952, lng: 98.6722},
      {name: 'Semarang', lat: -6.9666, lng: 110.4162},
      {name: 'Makassar', lat: -5.1477, lng: 119.4327},
      {name: 'Yogyakarta', lat: -7.7956, lng: 110.3695},
      {name: 'Palembang', lat: -2.9761, lng: 104.7754},
      {name: 'Aceh', lat: 5.5483, lng: 95.3238},
      {name: 'Bali', lat: -8.4095, lng: 115.1889},
    ],
  },
  {
    code: 'PK', nameEn: 'Pakistan', nameFr: 'Pakistan', nameAr: 'باكستان', method: 1,
    cities: [
      {name: 'Karachi', lat: 24.8607, lng: 67.0011},
      {name: 'Lahore', lat: 31.5204, lng: 74.3587},
      {name: 'Islamabad', lat: 33.6844, lng: 73.0479},
      {name: 'Rawalpindi', lat: 33.5651, lng: 73.0169},
      {name: 'Peshawar', lat: 34.0151, lng: 71.5249},
      {name: 'Quetta', lat: 30.1798, lng: 66.9750},
      {name: 'Multan', lat: 30.1575, lng: 71.5249},
      {name: 'Faisalabad', lat: 31.4504, lng: 73.1350},
    ],
  },
  {
    code: 'MY', nameEn: 'Malaysia', nameFr: 'Malaisie', nameAr: 'ماليزيا', method: 17,
    cities: [
      {name: 'Kuala Lumpur', lat: 3.1390, lng: 101.6869},
      {name: 'Johor Bahru', lat: 1.4927, lng: 103.7414},
      {name: 'Penang', lat: 5.4141, lng: 100.3288},
      {name: 'Kota Kinabalu', lat: 5.9804, lng: 116.0735},
      {name: 'Kuching', lat: 1.5535, lng: 110.3593},
      {name: 'Shah Alam', lat: 3.0738, lng: 101.5183},
      {name: 'Petaling Jaya', lat: 3.1073, lng: 101.6067},
    ],
  },
  {
    code: 'DZ', nameEn: 'Algeria', nameFr: 'Algérie', nameAr: 'الجزائر', method: 19,
    cities: [
      {name: 'Alger', lat: 36.7538, lng: 3.0588},
      {name: 'Oran', lat: 35.6969, lng: -0.6331},
      {name: 'Constantine', lat: 36.3650, lng: 6.6147},
      {name: 'Annaba', lat: 36.8979, lng: 7.7650},
      {name: 'Batna', lat: 35.5559, lng: 6.1742},
      {name: 'Sétif', lat: 36.1898, lng: 5.4108},
      {name: 'Tlemcen', lat: 34.8828, lng: -1.3167},
      {name: 'Blida', lat: 36.4700, lng: 2.8300},
      {name: 'Bejaia', lat: 36.7522, lng: 5.0564},
      {name: 'Tizi Ouzou', lat: 36.7169, lng: 4.0497},
    ],
  },
  {
    code: 'TN', nameEn: 'Tunisia', nameFr: 'Tunisie', nameAr: 'تونس', method: 18,
    cities: [
      {name: 'Tunis', lat: 36.8190, lng: 10.1658},
      {name: 'Sfax', lat: 34.7398, lng: 10.7600},
      {name: 'Sousse', lat: 35.8256, lng: 10.6369},
      {name: 'Kairouan', lat: 35.6781, lng: 10.0997},
      {name: 'Bizerte', lat: 37.2744, lng: 9.8739},
      {name: 'Gabès', lat: 33.8819, lng: 10.0982},
      {name: 'Monastir', lat: 35.7643, lng: 10.8113},
      {name: 'Nabeul', lat: 36.4561, lng: 10.7376},
    ],
  },
  {
    code: 'LY', nameEn: 'Libya', nameFr: 'Libye', nameAr: 'ليبيا', method: 3,
    cities: [
      {name: 'Tripoli', lat: 32.9033, lng: 13.1800},
      {name: 'Benghazi', lat: 32.1150, lng: 20.0670},
      {name: 'Misrata', lat: 32.3754, lng: 15.0925},
      {name: 'Tobruk', lat: 32.0874, lng: 23.9639},
    ],
  },
  {
    code: 'SD', nameEn: 'Sudan', nameFr: 'Soudan', nameAr: 'السودان', method: 3,
    cities: [
      {name: 'Khartoum', lat: 15.5007, lng: 32.5599},
      {name: 'Omdurman', lat: 15.6445, lng: 32.4777},
      {name: 'Port Sudan', lat: 19.6158, lng: 37.2164},
      {name: 'Kassala', lat: 15.4561, lng: 36.4003},
    ],
  },
  {
    code: 'IQ', nameEn: 'Iraq', nameFr: 'Irak', nameAr: 'العراق', method: 3,
    cities: [
      {name: 'Baghdad', lat: 33.3152, lng: 44.3661},
      {name: 'Basra', lat: 30.5085, lng: 47.7804},
      {name: 'Mosul', lat: 36.3350, lng: 43.1189},
      {name: 'Erbil', lat: 36.1901, lng: 44.0091},
      {name: 'Najaf', lat: 32.0003, lng: 44.3356},
      {name: 'Karbala', lat: 32.6136, lng: 44.0245},
    ],
  },
  {
    code: 'SY', nameEn: 'Syria', nameFr: 'Syrie', nameAr: 'سوريا', method: 3,
    cities: [
      {name: 'Damascus', lat: 33.5138, lng: 36.2765},
      {name: 'Aleppo', lat: 36.2021, lng: 37.1343},
      {name: 'Homs', lat: 34.7324, lng: 36.7137},
      {name: 'Hama', lat: 35.1318, lng: 36.7550},
      {name: 'Latakia', lat: 35.5317, lng: 35.7914},
    ],
  },
  {
    code: 'JO', nameEn: 'Jordan', nameFr: 'Jordanie', nameAr: 'الأردن', method: 23,
    cities: [
      {name: 'Amman', lat: 31.9539, lng: 35.9106},
      {name: 'Zarqa', lat: 32.0728, lng: 36.0878},
      {name: 'Irbid', lat: 32.5556, lng: 35.8500},
      {name: 'Aqaba', lat: 29.5321, lng: 35.0063},
    ],
  },
  {
    code: 'LB', nameEn: 'Lebanon', nameFr: 'Liban', nameAr: 'لبنان', method: 3,
    cities: [
      {name: 'Beirut', lat: 33.8938, lng: 35.5018},
      {name: 'Tripoli', lat: 34.4367, lng: 35.8497},
      {name: 'Sidon', lat: 33.5606, lng: 35.3714},
      {name: 'Tyre', lat: 33.2705, lng: 35.2038},
    ],
  },
  {
    code: 'KW', nameEn: 'Kuwait', nameFr: 'Koweït', nameAr: 'الكويت', method: 9,
    cities: [
      {name: 'Kuwait City', lat: 29.3759, lng: 47.9774},
      {name: 'Hawalli', lat: 29.3325, lng: 48.0313},
      {name: 'Salmiya', lat: 29.3370, lng: 48.0748},
    ],
  },
  {
    code: 'QA', nameEn: 'Qatar', nameFr: 'Qatar', nameAr: 'قطر', method: 10,
    cities: [
      {name: 'Doha', lat: 25.2854, lng: 51.5310},
      {name: 'Al Wakrah', lat: 25.1635, lng: 51.6020},
      {name: 'Al Khor', lat: 25.6834, lng: 51.4973},
    ],
  },
  {
    code: 'BH', nameEn: 'Bahrain', nameFr: 'Bahreïn', nameAr: 'البحرين', method: 8,
    cities: [
      {name: 'Manama', lat: 26.2235, lng: 50.5876},
      {name: 'Muharraq', lat: 26.2497, lng: 50.6127},
      {name: 'Riffa', lat: 26.1295, lng: 50.5553},
    ],
  },
  {
    code: 'OM', nameEn: 'Oman', nameFr: 'Oman', nameAr: 'عُمان', method: 8,
    cities: [
      {name: 'Muscat', lat: 23.5880, lng: 58.3829},
      {name: 'Salalah', lat: 17.0151, lng: 54.0924},
      {name: 'Nizwa', lat: 22.9333, lng: 57.5333},
      {name: 'Sohar', lat: 24.3476, lng: 56.7460},
    ],
  },
  {
    code: 'YE', nameEn: 'Yemen', nameFr: 'Yémen', nameAr: 'اليمن', method: 3,
    cities: [
      {name: "Sana'a", lat: 15.3694, lng: 44.1910},
      {name: 'Aden', lat: 12.7794, lng: 45.0367},
      {name: 'Taiz', lat: 13.5789, lng: 44.0209},
      {name: 'Hodeidah', lat: 14.7980, lng: 42.9511},
    ],
  },
  {
    code: 'IR', nameEn: 'Iran', nameFr: 'Iran', nameAr: 'إيران', method: 7,
    cities: [
      {name: 'Tehran', lat: 35.6892, lng: 51.3890},
      {name: 'Mashhad', lat: 36.2605, lng: 59.6168},
      {name: 'Isfahan', lat: 32.6546, lng: 51.6680},
      {name: 'Shiraz', lat: 29.5918, lng: 52.5837},
      {name: 'Tabriz', lat: 38.0800, lng: 46.2919},
      {name: 'Qom', lat: 34.6401, lng: 50.8764},
    ],
  },
  {
    code: 'FR', nameEn: 'France', nameFr: 'France', nameAr: 'فرنسا', method: 12,
    cities: [
      {name: 'Paris', lat: 48.8566, lng: 2.3522},
      {name: 'Marseille', lat: 43.2965, lng: 5.3698},
      {name: 'Lyon', lat: 45.7640, lng: 4.8357},
      {name: 'Toulouse', lat: 43.6047, lng: 1.4442},
      {name: 'Nice', lat: 43.7102, lng: 7.2620},
      {name: 'Nantes', lat: 47.2184, lng: -1.5536},
      {name: 'Strasbourg', lat: 48.5734, lng: 7.7521},
      {name: 'Bordeaux', lat: 44.8378, lng: -0.5792},
      {name: 'Lille', lat: 50.6292, lng: 3.0573},
      {name: 'Grenoble', lat: 45.1885, lng: 5.7245},
    ],
  },
  {
    code: 'BE', nameEn: 'Belgium', nameFr: 'Belgique', nameAr: 'بلجيكا', method: 3,
    cities: [
      {name: 'Brussels', lat: 50.8503, lng: 4.3517},
      {name: 'Antwerp', lat: 51.2194, lng: 4.4025},
      {name: 'Ghent', lat: 51.0543, lng: 3.7174},
      {name: 'Liège', lat: 50.6326, lng: 5.5797},
    ],
  },
  {
    code: 'NL', nameEn: 'Netherlands', nameFr: 'Pays-Bas', nameAr: 'هولندا', method: 3,
    cities: [
      {name: 'Amsterdam', lat: 52.3676, lng: 4.9041},
      {name: 'Rotterdam', lat: 51.9244, lng: 4.4777},
      {name: 'The Hague', lat: 52.0705, lng: 4.3007},
      {name: 'Utrecht', lat: 52.0907, lng: 5.1214},
    ],
  },
  {
    code: 'DE', nameEn: 'Germany', nameFr: 'Allemagne', nameAr: 'ألمانيا', method: 3,
    cities: [
      {name: 'Berlin', lat: 52.5200, lng: 13.4050},
      {name: 'Hamburg', lat: 53.5511, lng: 9.9937},
      {name: 'Munich', lat: 48.1351, lng: 11.5820},
      {name: 'Cologne', lat: 50.9333, lng: 6.9500},
      {name: 'Frankfurt', lat: 50.1109, lng: 8.6821},
      {name: 'Stuttgart', lat: 48.7758, lng: 9.1829},
      {name: 'Duisburg', lat: 51.4344, lng: 6.7623},
    ],
  },
  {
    code: 'GB', nameEn: 'United Kingdom', nameFr: 'Royaume-Uni', nameAr: 'المملكة المتحدة', method: 15,
    cities: [
      {name: 'London', lat: 51.5074, lng: -0.1278},
      {name: 'Birmingham', lat: 52.4862, lng: -1.8904},
      {name: 'Manchester', lat: 53.4808, lng: -2.2426},
      {name: 'Leeds', lat: 53.8008, lng: -1.5491},
      {name: 'Bradford', lat: 53.7960, lng: -1.7594},
      {name: 'Glasgow', lat: 55.8642, lng: -4.2518},
      {name: 'Leicester', lat: 52.6369, lng: -1.1398},
      {name: 'Luton', lat: 51.8787, lng: -0.4200},
    ],
  },
  {
    code: 'ES', nameEn: 'Spain', nameFr: 'Espagne', nameAr: 'إسبانيا', method: 3,
    cities: [
      {name: 'Madrid', lat: 40.4168, lng: -3.7038},
      {name: 'Barcelona', lat: 41.3851, lng: 2.1734},
      {name: 'Valencia', lat: 39.4699, lng: -0.3763},
      {name: 'Seville', lat: 37.3891, lng: -5.9845},
      {name: 'Málaga', lat: 36.7213, lng: -4.4213},
      {name: 'Ceuta', lat: 35.8894, lng: -5.3198},
      {name: 'Melilla', lat: 35.2923, lng: -2.9381},
    ],
  },
  {
    code: 'IT', nameEn: 'Italy', nameFr: 'Italie', nameAr: 'إيطاليا', method: 3,
    cities: [
      {name: 'Rome', lat: 41.9028, lng: 12.4964},
      {name: 'Milan', lat: 45.4642, lng: 9.1900},
      {name: 'Naples', lat: 40.8518, lng: 14.2681},
      {name: 'Turin', lat: 45.0703, lng: 7.6869},
    ],
  },
  {
    code: 'US', nameEn: 'United States', nameFr: 'États-Unis', nameAr: 'الولايات المتحدة', method: 2,
    cities: [
      {name: 'New York', lat: 40.7128, lng: -74.0060},
      {name: 'Los Angeles', lat: 34.0522, lng: -118.2437},
      {name: 'Chicago', lat: 41.8781, lng: -87.6298},
      {name: 'Houston', lat: 29.7604, lng: -95.3698},
      {name: 'Phoenix', lat: 33.4484, lng: -112.0740},
      {name: 'Philadelphia', lat: 39.9526, lng: -75.1652},
      {name: 'San Antonio', lat: 29.4241, lng: -98.4936},
      {name: 'Detroit', lat: 42.3314, lng: -83.0458},
      {name: 'Dearborn', lat: 42.3223, lng: -83.1763},
      {name: 'Washington DC', lat: 38.9072, lng: -77.0369},
    ],
  },
  {
    code: 'CA', nameEn: 'Canada', nameFr: 'Canada', nameAr: 'كندا', method: 2,
    cities: [
      {name: 'Toronto', lat: 43.6532, lng: -79.3832},
      {name: 'Montreal', lat: 45.5017, lng: -73.5673},
      {name: 'Vancouver', lat: 49.2827, lng: -123.1207},
      {name: 'Calgary', lat: 51.0447, lng: -114.0719},
      {name: 'Ottawa', lat: 45.4215, lng: -75.6972},
      {name: 'Edmonton', lat: 53.5461, lng: -113.4938},
    ],
  },
  {
    code: 'AU', nameEn: 'Australia', nameFr: 'Australie', nameAr: 'أستراليا', method: 3,
    cities: [
      {name: 'Sydney', lat: -33.8688, lng: 151.2093},
      {name: 'Melbourne', lat: -37.8136, lng: 144.9631},
      {name: 'Brisbane', lat: -27.4698, lng: 153.0251},
      {name: 'Perth', lat: -31.9505, lng: 115.8605},
      {name: 'Adelaide', lat: -34.9285, lng: 138.6007},
    ],
  },
  {
    code: 'ZA', nameEn: 'South Africa', nameFr: 'Afrique du Sud', nameAr: 'جنوب أفريقيا', method: 3,
    cities: [
      {name: 'Johannesburg', lat: -26.2041, lng: 28.0473},
      {name: 'Cape Town', lat: -33.9249, lng: 18.4241},
      {name: 'Durban', lat: -29.8587, lng: 31.0218},
      {name: 'Pretoria', lat: -25.7479, lng: 28.2293},
    ],
  },
  {
    code: 'RU', nameEn: 'Russia', nameFr: 'Russie', nameAr: 'روسيا', method: 14,
    cities: [
      {name: 'Moscow', lat: 55.7558, lng: 37.6173},
      {name: "Kazan'", lat: 55.7887, lng: 49.1221},
      {name: 'Ufa', lat: 54.7388, lng: 55.9721},
      {name: 'Grozny', lat: 43.3172, lng: 45.6988},
      {name: 'Makhachkala', lat: 42.9849, lng: 47.5047},
      {name: 'Saint Petersburg', lat: 59.9311, lng: 30.3609},
    ],
  },
  {
    code: 'SG', nameEn: 'Singapore', nameFr: 'Singapour', nameAr: 'سنغافورة', method: 11,
    cities: [
      {name: 'Singapore', lat: 1.3521, lng: 103.8198},
    ],
  },
  {
    code: 'IN', nameEn: 'India', nameFr: 'Inde', nameAr: 'الهند', method: 1,
    cities: [
      {name: 'Mumbai', lat: 19.0760, lng: 72.8777},
      {name: 'Delhi', lat: 28.6139, lng: 77.2090},
      {name: 'Hyderabad', lat: 17.3850, lng: 78.4867},
      {name: 'Lucknow', lat: 26.8467, lng: 80.9462},
      {name: 'Bangalore', lat: 12.9716, lng: 77.5946},
      {name: 'Chennai', lat: 13.0827, lng: 80.2707},
      {name: 'Kolkata', lat: 22.5726, lng: 88.3639},
      {name: 'Bhopal', lat: 23.2599, lng: 77.4126},
      {name: 'Srinagar', lat: 34.0837, lng: 74.7973},
    ],
  },
  {
    code: 'BD', nameEn: 'Bangladesh', nameFr: 'Bangladesh', nameAr: 'بنغلاديش', method: 1,
    cities: [
      {name: 'Dhaka', lat: 23.8103, lng: 90.4125},
      {name: 'Chittagong', lat: 22.3569, lng: 91.7832},
      {name: 'Sylhet', lat: 24.8949, lng: 91.8687},
      {name: 'Rajshahi', lat: 24.3636, lng: 88.6241},
    ],
  },
  {
    code: 'PS', nameEn: 'Palestine', nameFr: 'Palestine', nameAr: 'فلسطين', method: 3,
    cities: [
      {name: 'Jerusalem', lat: 31.7683, lng: 35.2137},
      {name: 'Gaza', lat: 31.5017, lng: 34.4674},
      {name: 'Ramallah', lat: 31.9022, lng: 35.2097},
      {name: 'Hebron', lat: 31.5326, lng: 35.0998},
      {name: 'Nablus', lat: 32.2228, lng: 35.2543},
    ],
  },
  {
    code: 'SE', nameEn: 'Sweden', nameFr: 'Suède', nameAr: 'السويد', method: 3,
    cities: [
      {name: 'Stockholm', lat: 59.3293, lng: 18.0686},
      {name: 'Malmö', lat: 55.6050, lng: 13.0038},
      {name: 'Gothenburg', lat: 57.7089, lng: 11.9746},
    ],
  },
  {
    code: 'NO', nameEn: 'Norway', nameFr: 'Norvège', nameAr: 'النرويج', method: 3,
    cities: [
      {name: 'Oslo', lat: 59.9139, lng: 10.7522},
      {name: 'Bergen', lat: 60.3928, lng: 5.3221},
    ],
  },
  {
    code: 'DK', nameEn: 'Denmark', nameFr: 'Danemark', nameAr: 'الدنمارك', method: 3,
    cities: [
      {name: 'Copenhagen', lat: 55.6761, lng: 12.5683},
      {name: 'Aarhus', lat: 56.1629, lng: 10.2039},
    ],
  },
  {
    code: 'CH', nameEn: 'Switzerland', nameFr: 'Suisse', nameAr: 'سويسرا', method: 3,
    cities: [
      {name: 'Zurich', lat: 47.3769, lng: 8.5417},
      {name: 'Geneva', lat: 46.2044, lng: 6.1432},
      {name: 'Basel', lat: 47.5596, lng: 7.5886},
    ],
  },
  {
    code: 'PT', nameEn: 'Portugal', nameFr: 'Portugal', nameAr: 'البرتغال', method: 22,
    cities: [
      {name: 'Lisbon', lat: 38.7169, lng: -9.1399},
      {name: 'Porto', lat: 41.1579, lng: -8.6291},
    ],
  },
  {
    code: 'NG', nameEn: 'Nigeria', nameFr: 'Nigéria', nameAr: 'نيجيريا', method: 3,
    cities: [
      {name: 'Lagos', lat: 6.5244, lng: 3.3792},
      {name: 'Kano', lat: 12.0022, lng: 8.5920},
      {name: 'Abuja', lat: 9.0765, lng: 7.3986},
      {name: 'Kaduna', lat: 10.5105, lng: 7.4165},
      {name: 'Sokoto', lat: 13.0535, lng: 5.2324},
    ],
  },
  {
    code: 'SN', nameEn: 'Senegal', nameFr: 'Sénégal', nameAr: 'السنغال', method: 3,
    cities: [
      {name: 'Dakar', lat: 14.7167, lng: -17.4677},
      {name: 'Touba', lat: 14.8506, lng: -15.8831},
      {name: 'Thiès', lat: 14.7886, lng: -16.9261},
    ],
  },
  {code: 'AZ', nameEn: 'Azerbaijan', nameFr: 'Azerbaïdjan', nameAr: 'أذربيجان', method: 3,
    cities: [{name: 'Baku', lat: 40.4093, lng: 49.8671}, {name: 'Ganja', lat: 40.6825, lng: 46.3606}]},
  {code: 'KZ', nameEn: 'Kazakhstan', nameFr: 'Kazakhstan', nameAr: 'كازاخستان', method: 3,
    cities: [{name: 'Almaty', lat: 43.2220, lng: 76.8512}, {name: 'Astana', lat: 51.1801, lng: 71.4460}]},
  {code: 'UZ', nameEn: 'Uzbekistan', nameFr: 'Ouzbékistan', nameAr: 'أوزبكستان', method: 3,
    cities: [{name: 'Tashkent', lat: 41.2995, lng: 69.2401}, {name: 'Samarkand', lat: 39.6270, lng: 66.9750}]},
  {code: 'AF', nameEn: 'Afghanistan', nameFr: 'Afghanistan', nameAr: 'أفغانستان', method: 1,
    cities: [{name: 'Kabul', lat: 34.5553, lng: 69.2075}, {name: 'Kandahar', lat: 31.6289, lng: 65.7372}, {name: 'Herat', lat: 34.3482, lng: 62.1998}]},
  {code: 'SO', nameEn: 'Somalia', nameFr: 'Somalie', nameAr: 'الصومال', method: 3,
    cities: [{name: 'Mogadishu', lat: 2.0469, lng: 45.3182}, {name: 'Hargeisa', lat: 9.5600, lng: 44.0650}]},
  {code: 'ET', nameEn: 'Ethiopia', nameFr: 'Éthiopie', nameAr: 'إثيوبيا', method: 3,
    cities: [{name: 'Addis Ababa', lat: 9.0320, lng: 38.7469}, {name: 'Dire Dawa', lat: 9.6000, lng: 41.8661}]},
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
