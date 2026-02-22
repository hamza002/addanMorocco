export interface City {
  name: string;
  nameAr: string;
  nameFr: string;
  lat: number;
  lng: number;
  region: string;
}

export const MOROCCAN_CITIES: City[] = [
  {name: 'Rabat', nameAr: 'الرباط', nameFr: 'Rabat', lat: 34.0209, lng: -6.8416, region: 'Rabat-Salé-Kénitra'},
  {name: 'Casablanca', nameAr: 'الدار البيضاء', nameFr: 'Casablanca', lat: 33.5731, lng: -7.5898, region: 'Casablanca-Settat'},
  {name: 'Marrakech', nameAr: 'مراكش', nameFr: 'Marrakech', lat: 31.6295, lng: -7.9811, region: 'Marrakech-Safi'},
  {name: 'Fes', nameAr: 'فاس', nameFr: 'Fès', lat: 34.0181, lng: -5.0078, region: 'Fès-Meknès'},
  {name: 'Tangier', nameAr: 'طنجة', nameFr: 'Tanger', lat: 35.7595, lng: -5.8340, region: 'Tanger-Tétouan-Al Hoceïma'},
  {name: 'Agadir', nameAr: 'أكادير', nameFr: 'Agadir', lat: 30.4278, lng: -9.5981, region: 'Souss-Massa'},
  {name: 'Oujda', nameAr: 'وجدة', nameFr: 'Oujda', lat: 34.6814, lng: -1.9086, region: 'Oriental'},
  {name: 'Kenitra', nameAr: 'القنيطرة', nameFr: 'Kénitra', lat: 34.2610, lng: -6.5802, region: 'Rabat-Salé-Kénitra'},
  {name: 'Tetouan', nameAr: 'تطوان', nameFr: 'Tétouan', lat: 35.5889, lng: -5.3626, region: 'Tanger-Tétouan-Al Hoceïma'},
  {name: 'Meknes', nameAr: 'مكناس', nameFr: 'Meknès', lat: 33.8935, lng: -5.5473, region: 'Fès-Meknès'},
  {name: 'Safi', nameAr: 'آسفي', nameFr: 'Safi', lat: 32.3008, lng: -9.2281, region: 'Marrakech-Safi'},
  {name: 'Mohammedia', nameAr: 'المحمدية', nameFr: 'Mohammedia', lat: 33.6861, lng: -7.3833, region: 'Casablanca-Settat'},
  {name: 'Khouribga', nameAr: 'خريبكة', nameFr: 'Khouribga', lat: 32.8813, lng: -6.9063, region: 'Béni Mellal-Khénifra'},
  {name: 'Beni Mellal', nameAr: 'بني ملال', nameFr: 'Béni Mellal', lat: 32.3373, lng: -6.3498, region: 'Béni Mellal-Khénifra'},
  {name: 'Nador', nameAr: 'الناظور', nameFr: 'Nador', lat: 35.1740, lng: -2.9287, region: 'Oriental'},
  {name: 'El Jadida', nameAr: 'الجديدة', nameFr: 'El Jadida', lat: 33.2549, lng: -8.5078, region: 'Casablanca-Settat'},
  {name: 'Taza', nameAr: 'تازة', nameFr: 'Taza', lat: 34.2100, lng: -4.0100, region: 'Fès-Meknès'},
  {name: 'Settat', nameAr: 'سطات', nameFr: 'Settat', lat: 33.0011, lng: -7.6165, region: 'Casablanca-Settat'},
  {name: 'Laayoune', nameAr: 'العيون', nameFr: 'Laâyoune', lat: 27.1253, lng: -13.1625, region: 'Laâyoune-Sakia El Hamra'},
  {name: 'Dakhla', nameAr: 'الداخلة', nameFr: 'Dakhla', lat: 23.6848, lng: -15.9573, region: 'Dakhla-Oued Ed-Dahab'},
  {name: 'Al Hoceima', nameAr: 'الحسيمة', nameFr: 'Al Hoceïma', lat: 35.2517, lng: -3.9372, region: 'Tanger-Tétouan-Al Hoceïma'},
  {name: 'Taroudant', nameAr: 'تارودانت', nameFr: 'Taroudant', lat: 30.4703, lng: -8.8773, region: 'Souss-Massa'},
  {name: 'Ouarzazate', nameAr: 'ورزازات', nameFr: 'Ouarzazate', lat: 30.9189, lng: -6.8934, region: 'Drâa-Tafilalet'},
  {name: 'Errachidia', nameAr: 'الراشيدية', nameFr: 'Errachidia', lat: 31.9314, lng: -4.4243, region: 'Drâa-Tafilalet'},
  {name: 'Ifrane', nameAr: 'إفران', nameFr: 'Ifrane', lat: 33.5228, lng: -5.1119, region: 'Fès-Meknès'},
  {name: 'Chefchaouen', nameAr: 'شفشاون', nameFr: 'Chefchaouen', lat: 35.1688, lng: -5.2636, region: 'Tanger-Tétouan-Al Hoceïma'},
  {name: 'Essaouira', nameAr: 'الصويرة', nameFr: 'Essaouira', lat: 31.5085, lng: -9.7595, region: 'Marrakech-Safi'},
  {name: 'Tiznit', nameAr: 'تيزنيت', nameFr: 'Tiznit', lat: 29.6974, lng: -9.7316, region: 'Souss-Massa'},
  {name: 'Guelmim', nameAr: 'كلميم', nameFr: 'Guelmim', lat: 28.9870, lng: -10.0574, region: 'Guelmim-Oued Noun'},
  {name: 'Sale', nameAr: 'سلا', nameFr: 'Salé', lat: 34.0531, lng: -6.7985, region: 'Rabat-Salé-Kénitra'},
];

export const getCityName = (city: City, lang: string): string => {
  switch (lang) {
    case 'ar':
      return city.nameAr;
    case 'fr':
      return city.nameFr;
    default:
      return city.name;
  }
};
