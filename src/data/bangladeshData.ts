/**
 * Bangladesh Administrative and Education Master Data
 * For Asad Computer & Training Center Application Forms
 */

export interface DistrictData {
  name: string;
  bnName: string;
  division: string;
  upazilas: { en: string; bn: string }[];
}

export const BANGLADESH_DISTRICTS: DistrictData[] = [
  // Rangpur Division (Local Region - Thakurgaon, Dinajpur, Panchagarh priority)
  {
    name: 'Thakurgaon',
    bnName: 'ঠাকুরগাঁও',
    division: 'Rangpur',
    upazilas: [
      { en: 'Thakurgaon Sadar', bn: 'ঠাকুরগাঁও সদর' },
      { en: 'Pirganj', bn: 'পীরগঞ্জ' },
      { en: 'Ranisankail', bn: 'রাণীশংকৈল' },
      { en: 'Haripur', bn: 'হরিপুর' },
      { en: 'Baliadangi', bn: 'বালিয়াডাঙ্গী' },
      { en: 'Ruhia', bn: 'রুহিয়া' },
    ],
  },
  {
    name: 'Dinajpur',
    bnName: 'দিনাজপুর',
    division: 'Rangpur',
    upazilas: [
      { en: 'Dinajpur Sadar', bn: 'দিনাজপুর সদর' },
      { en: 'Birganj', bn: 'বীরগঞ্জ' },
      { en: 'Kaharole', bn: 'কাহারোল' },
      { en: 'Bochaganj', bn: 'বোচাগঞ্জ' },
      { en: 'Birol', bn: 'বিরল' },
      { en: 'Chirirbandar', bn: 'চিরিরবন্দর' },
      { en: 'Parbatipur', bn: 'পার্বতীপুর' },
      { en: 'Fulbari', bn: 'ফুলবাড়ী' },
      { en: 'Nawabganj', bn: 'নবাবগঞ্জ' },
      { en: 'Ghoraghat', bn: 'ঘোড়াঘাট' },
      { en: 'Hakimpur', bn: 'হাকিমপুর' },
      { en: 'Khansama', bn: 'খানসামা' },
      { en: 'Birampur', bn: 'বিরামপুর' },
    ],
  },
  {
    name: 'Panchagarh',
    bnName: 'পঞ্চগড়',
    division: 'Rangpur',
    upazilas: [
      { en: 'Panchagarh Sadar', bn: 'পঞ্চগড় সদর' },
      { en: 'Boda', bn: 'বোদা' },
      { en: 'Atwari', bn: 'আটোয়ারী' },
      { en: 'Tetulia', bn: 'তেঁতুলিয়া' },
      { en: 'Debiganj', bn: 'দেবীগঞ্জ' },
    ],
  },
  {
    name: 'Rangpur',
    bnName: 'রংপুর',
    division: 'Rangpur',
    upazilas: [
      { en: 'Rangpur Sadar', bn: 'রংপুর সদর' },
      { en: 'Badarganj', bn: 'বদরগঞ্জ' },
      { en: 'Gangachara', bn: 'গঙ্গাচড়া' },
      { en: 'Kaunia', bn: 'কাউনিয়া' },
      { en: 'Mithapukur', bn: 'মিঠাপুকুর' },
      { en: 'Pirgachha', bn: 'পীরগাছা' },
      { en: 'Pirganj', bn: 'পীরগঞ্জ' },
      { en: 'Taraganj', bn: 'তারাগঞ্জ' },
    ],
  },
  {
    name: 'Nilphamari',
    bnName: 'নীলফামারী',
    division: 'Rangpur',
    upazilas: [
      { en: 'Nilphamari Sadar', bn: 'নীলফামারী সদর' },
      { en: 'Saidpur', bn: 'সৈয়দপুর' },
      { en: 'Domar', bn: 'ডোমার' },
      { en: 'Dimla', bn: 'ডিমলা' },
      { en: 'Jaldhaka', bn: 'জলঢাকা' },
      { en: 'Kishoreganj', bn: 'কিশোরগঞ্জ' },
    ],
  },
  {
    name: 'Kurigram',
    bnName: 'কুড়িগ্রাম',
    division: 'Rangpur',
    upazilas: [
      { en: 'Kurigram Sadar', bn: 'কুড়িগ্রাম সদর' },
      { en: 'Nageshwari', bn: 'নাগেশ্বরী' },
      { en: 'Bhurungamari', bn: 'ভুরুঙ্গামারী' },
      { en: 'Phulbari', bn: 'ফুলবাড়ী' },
      { en: 'Rajarhat', bn: 'রাজারহাট' },
      { en: 'Ulipur', bn: 'উলিপুর' },
      { en: 'Chilmari', bn: 'চিলমারী' },
      { en: 'Rowmari', bn: 'রৌমারী' },
      { en: 'Char Rajibpur', bn: 'চর রাজিবপুর' },
    ],
  },
  {
    name: 'Lalmonirhat',
    bnName: 'লালমনিরহাট',
    division: 'Rangpur',
    upazilas: [
      { en: 'Lalmonirhat Sadar', bn: 'লালমনিরহাট সদর' },
      { en: 'Patgram', bn: 'পাটগ্রাম' },
      { en: 'Hatibandha', bn: 'হাতীবান্ধা' },
      { en: 'Kaliganj', bn: 'কালীগঞ্জ' },
      { en: 'Aditmari', bn: 'আদিতমারী' },
    ],
  },
  {
    name: 'Gaibandha',
    bnName: 'গাইবান্ধা',
    division: 'Rangpur',
    upazilas: [
      { en: 'Gaibandha Sadar', bn: 'গাইবান্ধা সদর' },
      { en: 'Sadullapur', bn: 'সাদুল্লাপুর' },
      { en: 'Gobindaganj', bn: 'গোবিন্দগঞ্জ' },
      { en: 'Sundarganj', bn: 'সুন্দরগঞ্জ' },
      { en: 'Saghata', bn: 'সাঘাটা' },
      { en: 'Palashbari', bn: 'পলাশবাড়ী' },
      { en: 'Fulchhari', bn: 'ফুলছড়ি' },
    ],
  },

  // Dhaka Division
  {
    name: 'Dhaka',
    bnName: 'ঢাকা',
    division: 'Dhaka',
    upazilas: [
      { en: 'Dhanmondi', bn: 'ধানমন্ডি' },
      { en: 'Mirpur', bn: 'মিরপুর' },
      { en: 'Uttara', bn: 'উত্তরা' },
      { en: 'Gulshan', bn: 'গুলশান' },
      { en: 'Mohammadpur', bn: 'মোহাম্মদপুর' },
      { en: 'Savar', bn: 'সাভার' },
      { en: 'Dhamrai', bn: 'ধামরাই' },
      { en: 'Keraniganj', bn: 'কেরানীগঞ্জ' },
      { en: 'Dohar', bn: 'দোহার' },
      { en: 'Nawabganj', bn: 'নবাবগঞ্জ' },
    ],
  },
  {
    name: 'Gazipur',
    bnName: 'গাজীপুর',
    division: 'Dhaka',
    upazilas: [
      { en: 'Gazipur Sadar', bn: 'গাজীপুর সদর' },
      { en: 'Kaliakair', bn: 'কালিয়াকৈর' },
      { en: 'Kapasia', bn: 'কাপাসিয়া' },
      { en: 'Sreepur', bn: 'শ্রীপুর' },
      { en: 'Kaliganj', bn: 'কালীগঞ্জ' },
    ],
  },
  {
    name: 'Narayanganj',
    bnName: 'নারায়ণগঞ্জ',
    division: 'Dhaka',
    upazilas: [
      { en: 'Narayanganj Sadar', bn: 'নারায়ণগঞ্জ সদর' },
      { en: 'Bandar', bn: 'বন্দর' },
      { en: 'Rupganj', bn: 'রূপগঞ্জ' },
      { en: 'Sonargaon', bn: 'সোনারগাঁও' },
      { en: 'Araihazar', bn: 'আড়াইহাজার' },
    ],
  },
  {
    name: 'Tangail',
    bnName: 'টাঙ্গাইল',
    division: 'Dhaka',
    upazilas: [
      { en: 'Tangail Sadar', bn: 'টাঙ্গাইল সদর' },
      { en: 'Mirzapur', bn: 'মির্জাপুর' },
      { en: 'Nagarpur', bn: 'নাগরপুর' },
      { en: 'Ghatail', bn: 'ঘাটাইল' },
      { en: 'Madhupur', bn: 'মধুপুর' },
      { en: 'Gopalpur', bn: 'গোপালপুর' },
      { en: 'Sakhipur', bn: 'সখিপুর' },
      { en: 'Delduar', bn: 'দেলদুয়ার' },
      { en: 'Kalihati', bn: 'কালিহাতী' },
      { en: 'Basail', bn: 'বাসাইল' },
      { en: 'Bhuapur', bn: 'ভুয়াপুর' },
      { en: 'Dhanbari', bn: 'ধনবাড়ী' },
    ],
  },
  {
    name: 'Kishoreganj',
    bnName: 'কিশোরগঞ্জ',
    division: 'Dhaka',
    upazilas: [
      { en: 'Kishoreganj Sadar', bn: 'কিশোরগঞ্জ সদর' },
      { en: 'Bhairab', bn: 'ভৈরব' },
      { en: 'Bajitpur', bn: 'বাজিতপুর' },
      { en: 'Katiadi', bn: 'কটিয়াদী' },
      { en: 'Karimganj', bn: 'করিমগঞ্জ' },
      { en: 'Nikli', bn: 'নিকলী' },
      { en: 'Tarail', bn: 'তাড়াইল' },
      { en: 'Hossainpur', bn: 'হোসেনপুর' },
      { en: 'Pakundia', bn: 'পাকুন্দিয়া' },
      { en: 'Kuliarchar', bn: 'কুলিয়ারচর' },
      { en: 'Itna', bn: 'ইটনা' },
      { en: 'Mithamain', bn: 'মিঠামইন' },
      { en: 'Austagram', bn: 'অষ্টগ্রাম' },
    ],
  },
  {
    name: 'Manikganj',
    bnName: 'মানিকগঞ্জ',
    division: 'Dhaka',
    upazilas: [
      { en: 'Manikganj Sadar', bn: 'মানিকগঞ্জ সদর' },
      { en: 'Singair', bn: 'সিংগাইর' },
      { en: 'Shivalaya', bn: 'শিবালয়' },
      { en: 'Saturia', bn: 'সাটুরিয়া' },
      { en: 'Harirampur', bn: 'হরিরামপুর' },
      { en: 'Ghior', bn: 'ঘিওর' },
      { en: 'Daulatpur', bn: 'দৌলতপুর' },
    ],
  },
  {
    name: 'Munshiganj',
    bnName: 'মুন্সীগঞ্জ',
    division: 'Dhaka',
    upazilas: [
      { en: 'Munshiganj Sadar', bn: 'মুন্সীগঞ্জ সদর' },
      { en: 'Sreenagar', bn: 'শ্রীনগর' },
      { en: 'Sirajdikhan', bn: 'সিরাজদিখান' },
      { en: 'Louhajang', bn: 'লৌহজং' },
      { en: 'Tongibari', bn: 'টংগিবাড়ী' },
      { en: 'Gazaria', bn: 'গজারিয়া' },
    ],
  },
  {
    name: 'Narsingdi',
    bnName: 'নরসিংদী',
    division: 'Dhaka',
    upazilas: [
      { en: 'Narsingdi Sadar', bn: 'নরসিংদী সদর' },
      { en: 'Palash', bn: 'পলাশ' },
      { en: 'Shibpur', bn: 'শিবপুর' },
      { en: 'Raipura', bn: 'রায়পুরা' },
      { en: 'Belabo', bn: 'বেলাবো' },
      { en: 'Monohardi', bn: 'মনোহরদী' },
    ],
  },
  {
    name: 'Faridpur',
    bnName: 'ফরিদপুর',
    division: 'Dhaka',
    upazilas: [
      { en: 'Faridpur Sadar', bn: 'ফরিদপুর সদর' },
      { en: 'Boalmari', bn: 'বোয়ালমারী' },
      { en: 'Bhanga', bn: 'ভাঙ্গা' },
      { en: 'Nagarkanda', bn: 'নগরকান্দা' },
      { en: 'Madhukhali', bn: 'মধুখালী' },
      { en: 'Sadarpur', bn: 'সদরপুর' },
      { en: 'Charbhadrasan', bn: 'চরভদ্রাসন' },
      { en: 'Alfadanga', bn: 'আলফাডাঙ্গা' },
      { en: 'Saltha', bn: 'সালথা' },
    ],
  },
  {
    name: 'Gopalganj',
    bnName: 'গোপালগঞ্জ',
    division: 'Dhaka',
    upazilas: [
      { en: 'Gopalganj Sadar', bn: 'গোপালগঞ্জ সদর' },
      { en: 'Kashiani', bn: 'কাশিয়ানী' },
      { en: 'Kotalipara', bn: 'কোটালীপাড়া' },
      { en: 'Muksudpur', bn: 'মুকসুদপুর' },
      { en: 'Tungipara', bn: 'টুঙ্গিপাড়া' },
    ],
  },
  {
    name: 'Madaripur',
    bnName: 'মাদারীপুর',
    division: 'Dhaka',
    upazilas: [
      { en: 'Madaripur Sadar', bn: 'মাদারীপুর সদর' },
      { en: 'Shibchar', bn: 'শিবচর' },
      { en: 'Kalkini', bn: 'কালকিনি' },
      { en: 'Rajoir', bn: 'রাজৈর' },
      { en: 'Dasar', bn: 'ডাসার' },
    ],
  },
  {
    name: 'Rajbari',
    bnName: 'রাজবাড়ী',
    division: 'Dhaka',
    upazilas: [
      { en: 'Rajbari Sadar', bn: 'রাজবাড়ী সদর' },
      { en: 'Goalanda', bn: 'গোয়ালন্দ' },
      { en: 'Pangsha', bn: 'পাংশা' },
      { en: 'Baliakandi', bn: 'বালিয়াকান্দি' },
      { en: 'Kalukhali', bn: 'কালুখালী' },
    ],
  },
  {
    name: 'Shariatpur',
    bnName: 'শরীয়তপুর',
    division: 'Dhaka',
    upazilas: [
      { en: 'Shariatpur Sadar', bn: 'শরীয়তপুর সদর' },
      { en: 'Zajira', bn: 'জাজিরা' },
      { en: 'Naria', bn: 'নড়িয়া' },
      { en: 'Bhedarganj', bn: 'ভেদরগঞ্জ' },
      { en: 'Damudya', bn: 'ডামুড্যা' },
      { en: 'Gosairhat', bn: 'গোসাইরহাট' },
    ],
  },

  // Rajshahi Division
  {
    name: 'Rajshahi',
    bnName: 'রাজশাহী',
    division: 'Rajshahi',
    upazilas: [
      { en: 'Boalia', bn: 'বোয়ালিয়া' },
      { en: 'Motihar', bn: 'মতিহার' },
      { en: 'Paba', bn: 'পবা' },
      { en: 'Godagari', bn: 'গোদাগাড়ী' },
      { en: 'Tanore', bn: 'তানোর' },
      { en: 'Bagmara', bn: 'বাগমারা' },
      { en: 'Durgapur', bn: 'দুর্গাপুর' },
      { en: 'Puthia', bn: 'পুঠিয়া' },
      { en: 'Charghat', bn: 'চারঘাট' },
      { en: 'Bagha', bn: 'বাঘা' },
      { en: 'Mohonpur', bn: 'মোহনপুর' },
    ],
  },
  {
    name: 'Bogura',
    bnName: 'বগুড়া',
    division: 'Rajshahi',
    upazilas: [
      { en: 'Bogura Sadar', bn: 'বগুড়া সদর' },
      { en: 'Sherpur', bn: 'শেরপুর' },
      { en: 'Shibganj', bn: 'শিবগঞ্জ' },
      { en: 'Gabtali', bn: 'গাবতলী' },
      { en: 'Kahaloo', bn: 'কাহালু' },
      { en: 'Dhunat', bn: 'ধুনট' },
      { en: 'Sariakandi', bn: 'সারিয়াকান্দি' },
      { en: 'Sonatala', bn: 'সোনাতলা' },
      { en: 'Nandigram', bn: 'নন্দীগ্রাম' },
      { en: 'Adamdighi', bn: 'আদমদীঘি' },
      { en: 'Dupchanchia', bn: 'দুপচাঁচিয়া' },
      { en: 'Shajahanpur', bn: 'শাজাহানপুর' },
    ],
  },
  {
    name: 'Pabna',
    bnName: 'পাবনা',
    division: 'Rajshahi',
    upazilas: [
      { en: 'Pabna Sadar', bn: 'পাবনা সদর' },
      { en: 'Ishwardi', bn: 'ঈশ্বরদী' },
      { en: 'Atgharia', bn: 'আটঘরিয়া' },
      { en: 'Chatmohar', bn: 'চাটমোহর' },
      { en: 'Bhangura', bn: 'ভাঙ্গুড়া' },
      { en: 'Faridpur', bn: 'ফরিদপুর' },
      { en: 'Santhia', bn: 'সাঁথিয়া' },
      { en: 'Bera', bn: 'বেড়া' },
      { en: 'Sujanagar', bn: 'সুজানগর' },
    ],
  },
  {
    name: 'Sirajganj',
    bnName: 'সিরাজগঞ্জ',
    division: 'Rajshahi',
    upazilas: [
      { en: 'Sirajganj Sadar', bn: 'সিরাজগঞ্জ সদর' },
      { en: 'Shahjadpur', bn: 'শাহজাদপুর' },
      { en: 'Ullapara', bn: 'উল্লাপাড়া' },
      { en: 'Belkuchi', bn: 'বেলকুচি' },
      { en: 'Tarash', bn: 'তাড়াশ' },
      { en: 'Raiganj', bn: 'রায়গঞ্জ' },
      { en: 'Kamarkhanda', bn: 'কামারখন্দ' },
      { en: 'Kazipur', bn: 'কাজীপুর' },
      { en: 'Chauhali', bn: 'চৌহালী' },
    ],
  },
  {
    name: 'Naogaon',
    bnName: 'নওগাঁ',
    division: 'Rajshahi',
    upazilas: [
      { en: 'Naogaon Sadar', bn: 'নওগাঁ সদর' },
      { en: 'Manda', bn: 'মান্দা' },
      { en: 'Mohadevpur', bn: 'মহাদেবপুর' },
      { en: 'Patnitala', bn: 'পত্নীতলা' },
      { en: 'Dhamoirhat', bn: 'ধামইরহাট' },
      { en: 'Sapahar', bn: 'সাপাহার' },
      { en: 'Porsha', bn: 'পোরশা' },
      { en: 'Raninagar', bn: 'রানীনগর' },
      { en: 'Atrai', bn: 'আত্রাই' },
      { en: 'Badalgachhi', bn: 'বদলগাছী' },
      { en: 'Niamatpur', bn: 'নিয়ামতপুর' },
    ],
  },
  {
    name: 'Natore',
    bnName: 'নাটোর',
    division: 'Rajshahi',
    upazilas: [
      { en: 'Natore Sadar', bn: 'নাটোর সদর' },
      { en: 'Singra', bn: 'সিংড়া' },
      { en: 'Baraigram', bn: 'বড়াইগ্রাম' },
      { en: 'Bagatipara', bn: 'বাগাতিপাড়া' },
      { en: 'Lalpur', bn: 'লালপুর' },
      { en: 'Gurudaspur', bn: 'গুরুদাসপুর' },
      { en: 'Naldanga', bn: 'নলডাঙ্গা' },
    ],
  },
  {
    name: 'Chapainawabganj',
    bnName: 'চাঁপাইনবাবগঞ্জ',
    division: 'Rajshahi',
    upazilas: [
      { en: 'Chapainawabganj Sadar', bn: 'চাঁপাইনবাবগঞ্জ সদর' },
      { en: 'Shibganj', bn: 'শিবগঞ্জ' },
      { en: 'Gomostapur', bn: 'গোমস্তাপুর' },
      { en: 'Nachole', bn: 'নাচোল' },
      { en: 'Bholahat', bn: 'ভোলাহাট' },
    ],
  },
  {
    name: 'Joypurhat',
    bnName: 'জয়পুরহাট',
    division: 'Rajshahi',
    upazilas: [
      { en: 'Joypurhat Sadar', bn: 'জয়পুরহাট সদর' },
      { en: 'Panchbibi', bn: 'পাঁচবিবি' },
      { en: 'Khetlal', bn: 'ক্ষেতলাল' },
      { en: 'Akkelpur', bn: 'আক্কেলপুর' },
      { en: 'Kalai', bn: 'কালাই' },
    ],
  },

  // Chittagong Division
  {
    name: 'Chittagong',
    bnName: 'চট্টগ্রাম',
    division: 'Chittagong',
    upazilas: [
      { en: 'Kotwali', bn: 'কোতোয়ালী' },
      { en: 'Panchlaish', bn: 'পাঁচলাইশ' },
      { en: 'Hathazari', bn: 'হাটহাজারী' },
      { en: 'Raozan', bn: 'রাউজান' },
      { en: 'Fatikchhari', bn: 'ফটিকছড়ি' },
      { en: 'Patiya', bn: 'পটিয়া' },
      { en: 'Sitakunda', bn: 'সীতাকুণ্ড' },
      { en: 'Mirsharai', bn: 'মীরসরাই' },
      { en: 'Boalkhali', bn: 'বোয়ালখালী' },
      { en: 'Anwara', bn: 'আনোয়ারা' },
      { en: 'Chandanaish', bn: 'চন্দনাইশ' },
      { en: 'Satkania', bn: 'সাতকানিয়া' },
      { en: 'Lohagara', bn: 'লোহাগাড়া' },
      { en: 'Banshkhali', bn: 'বাঁশখালী' },
      { en: 'Sandwip', bn: 'সন্দ্বীপ' },
      { en: 'Karnafuli', bn: 'কর্ণফুলী' },
    ],
  },
  {
    name: 'Cox\'s Bazar',
    bnName: 'কক্সবাজার',
    division: 'Chittagong',
    upazilas: [
      { en: 'Cox\'s Bazar Sadar', bn: 'কক্সবাজার সদর' },
      { en: 'Chakaria', bn: 'চকোরিয়া' },
      { en: 'Teknaf', bn: 'টেকনাফ' },
      { en: 'Ukhia', bn: 'উখিয়া' },
      { en: 'Ramu', bn: 'রামু' },
      { en: 'Maheshkhali', bn: 'মহেশখালী' },
      { en: 'Kutubdia', bn: 'কুতুবদিয়া' },
      { en: 'Pekua', bn: 'পেকুয়া' },
      { en: 'Eidgaon', bn: 'ঈদগাঁও' },
    ],
  },
  {
    name: 'Cumilla',
    bnName: 'কুমিল্লা',
    division: 'Chittagong',
    upazilas: [
      { en: 'Cumilla Adarsha Sadar', bn: 'কুমিল্লা আদর্শ সদর' },
      { en: 'Cumilla Sadar Dakshin', bn: 'কুমিল্লা সদর দক্ষিণ' },
      { en: 'Daudkandi', bn: 'দাউদকান্দি' },
      { en: 'Chandina', bn: 'চান্দিনা' },
      { en: 'Debidwar', bn: 'দেবিদ্বার' },
      { en: 'Muradnagar', bn: 'মুরাদনগর' },
      { en: 'Burichang', bn: 'বুড়িচং' },
      { en: 'Brahmanpara', bn: 'ব্রাহ্মণপাড়া' },
      { en: 'Laksam', bn: 'লাকসাম' },
      { en: 'Monohargonj', bn: 'মনোহরগঞ্জ' },
      { en: 'Barura', bn: 'বরুড়া' },
      { en: 'Chauddagram', bn: 'চৌদ্দগ্রাম' },
      { en: 'Homna', bn: 'হোমনা' },
      { en: 'Titas', bn: 'তিতাস' },
      { en: 'Meghna', bn: 'মেঘনা' },
      { en: 'Lalmai', bn: 'লালমাই' },
    ],
  },
  {
    name: 'Feni',
    bnName: 'ফেনী',
    division: 'Chittagong',
    upazilas: [
      { en: 'Feni Sadar', bn: 'ফেনী সদর' },
      { en: 'Daganbhuiyan', bn: 'দাগনভূঞা' },
      { en: 'Sonagazi', bn: 'সোনাগাজী' },
      { en: 'Chhagalnaiya', bn: 'ছাগলনাইয়া' },
      { en: 'Parshuram', bn: 'পরশুরাম' },
      { en: 'Fulgazi', bn: 'ফুলগাজী' },
    ],
  },
  {
    name: 'Brahmanbaria',
    bnName: 'ব্রাহ্মণবাড়িয়া',
    division: 'Chittagong',
    upazilas: [
      { en: 'Brahmanbaria Sadar', bn: 'ব্রাহ্মণবাড়িয়া সদর' },
      { en: 'Kasba', bn: 'কসবা' },
      { en: 'Nasirnagar', bn: 'নাসিরনগর' },
      { en: 'Sarail', bn: 'সরাইল' },
      { en: 'Ashuganj', bn: 'আশুগঞ্জ' },
      { en: 'Akhaura', bn: 'আখাউড়া' },
      { en: 'Nabinagar', bn: 'নবীনগর' },
      { en: 'Bancharampur', bn: 'বাঞ্ছারামপুর' },
      { en: 'Bijoynagar', bn: 'বিজয়নগর' },
    ],
  },
  {
    name: 'Noakhali',
    bnName: 'নোয়াখালী',
    division: 'Chittagong',
    upazilas: [
      { en: 'Noakhali Sadar', bn: 'নোয়াখালী সদর' },
      { en: 'Begumganj', bn: 'বেগমগঞ্জ' },
      { en: 'Chatkhil', bn: 'চাটখিল' },
      { en: 'Companiganj', bn: 'কোম্পানীগঞ্জ' },
      { en: 'Hatia', bn: 'হাতিয়া' },
      { en: 'Senbagh', bn: 'সেনবাগ' },
      { en: 'Subarnachar', bn: 'সুবর্ণচর' },
      { en: 'Sonaimuri', bn: 'সোনাইমুড়ী' },
      { en: 'Kabirhat', bn: 'কবিরহাট' },
    ],
  },
  {
    name: 'Chandpur',
    bnName: 'চাঁদপুর',
    division: 'Chittagong',
    upazilas: [
      { en: 'Chandpur Sadar', bn: 'চাঁদপুর সদর' },
      { en: 'Hajiganj', bn: 'হাজীগঞ্জ' },
      { en: 'Kachua', bn: 'কচুয়া' },
      { en: 'Faridganj', bn: 'ফরিদগঞ্জ' },
      { en: 'Matlab Uttar', bn: 'মতলব উত্তর' },
      { en: 'Matlab Dakshin', bn: 'মতলব দক্ষিণ' },
      { en: 'Shahrasti', bn: 'শাহরাস্তি' },
      { en: 'Haimchar', bn: 'হাইমচর' },
    ],
  },
  {
    name: 'Lakshmipur',
    bnName: 'লক্ষ্মীপুর',
    division: 'Chittagong',
    upazilas: [
      { en: 'Lakshmipur Sadar', bn: 'লক্ষ্মীপুর সদর' },
      { en: 'Raipur', bn: 'রায়পুর' },
      { en: 'Ramganj', bn: 'রামগঞ্জ' },
      { en: 'Ramgati', bn: 'রামগতি' },
      { en: 'Kamalnagar', bn: 'কমলনগর' },
    ],
  },

  // Khulna Division
  {
    name: 'Khulna',
    bnName: 'খুলনা',
    division: 'Khulna',
    upazilas: [
      { en: 'Khulna Sadar', bn: 'খুলনা সদর' },
      { en: 'Sonadanga', bn: 'সোনাডাঙ্গা' },
      { en: 'Khalishpur', bn: 'খালিশপুর' },
      { en: 'Daulatpur', bn: 'দৌলতপুর' },
      { en: 'Khan Jahan Ali', bn: 'খান জাহান আলী' },
      { en: 'Dumuria', bn: 'ডুমুরিয়া' },
      { en: 'Batiaghata', bn: 'বটিয়াঘাটা' },
      { en: 'Dacope', bn: 'দাকোপ' },
      { en: 'Paikgachha', bn: 'পাইকগাছা' },
      { en: 'Koyra', bn: 'কয়রা' },
      { en: 'Rupsha', bn: 'রূপসা' },
      { en: 'Terokhada', bn: 'তেরখাদা' },
      { en: 'Dighalia', bn: 'দিঘলিয়া' },
    ],
  },
  {
    name: 'Jashore',
    bnName: 'যশোর',
    division: 'Khulna',
    upazilas: [
      { en: 'Jashore Sadar', bn: 'যশোর সদর' },
      { en: 'Jhikargachha', bn: 'ঝিকরগাছা' },
      { en: 'Sharsha', bn: 'শার্শা' },
      { en: 'Manirampur', bn: 'মণিরামপুর' },
      { en: 'Keshabpur', bn: 'কেশবপুর' },
      { en: 'Bagherpara', bn: 'বাঘারপাড়া' },
      { en: 'Abhaynagar', bn: 'অভয়নগর' },
      { en: 'Chaugachha', bn: 'চৌগাছা' },
    ],
  },
  {
    name: 'Kushtia',
    bnName: 'কুষ্টিয়া',
    division: 'Khulna',
    upazilas: [
      { en: 'Kushtia Sadar', bn: 'কুষ্টিয়া সদর' },
      { en: 'Kumarkhali', bn: 'কুমারখালী' },
      { en: 'Khoksa', bn: 'খোকসা' },
      { en: 'Mirpur', bn: 'মিরপুর' },
      { en: 'Bheramara', bn: 'ভেড়ামারা' },
      { en: 'Daulatpur', bn: 'দৌলতপুর' },
    ],
  },
  {
    name: 'Satkhira',
    bnName: 'সাতক্ষীরা',
    division: 'Khulna',
    upazilas: [
      { en: 'Satkhira Sadar', bn: 'সাতক্ষীরা সদর' },
      { en: 'Kalaroa', bn: 'কলারোয়া' },
      { en: 'Tala', bn: 'তালা' },
      { en: 'Debhata', bn: 'দেবহাটা' },
      { en: 'Kaliganj', bn: 'কালীগঞ্জ' },
      { en: 'Assasuni', bn: 'আশাশুনি' },
      { en: 'Shyamnagar', bn: 'শ্যামনগর' },
    ],
  },
  {
    name: 'Bagerhat',
    bnName: 'বাগেরহাট',
    division: 'Khulna',
    upazilas: [
      { en: 'Bagerhat Sadar', bn: 'বাগেরহাট সদর' },
      { en: 'Fakirhat', bn: 'ফকিরহাট' },
      { en: 'Mollahat', bn: 'মোল্লাহাট' },
      { en: 'Rampal', bn: 'রামপাল' },
      { en: 'Mongla', bn: 'মোংলা' },
      { en: 'Morrelganj', bn: 'মোড়েলগঞ্জ' },
      { en: 'Kachua', bn: 'কচুয়া' },
      { en: 'Sarankhola', bn: 'শরণখোলা' },
      { en: 'Chitalmari', bn: 'চিতলমারী' },
    ],
  },
  {
    name: 'Jhenaidah',
    bnName: 'ঝিনাইদহ',
    division: 'Khulna',
    upazilas: [
      { en: 'Jhenaidah Sadar', bn: 'ঝিনাইদহ সদর' },
      { en: 'Kaliganj', bn: 'কালীগঞ্জ' },
      { en: 'Kotchandpur', bn: 'কোটচাঁদপুর' },
      { en: 'Maheshpur', bn: 'মহেশপুর' },
      { en: 'Shailkupa', bn: 'শৈলকুপা' },
      { en: 'Harinakunda', bn: 'হরিণাকুণ্ডু' },
    ],
  },
  {
    name: 'Chuadanga',
    bnName: 'চুয়াডাঙ্গা',
    division: 'Khulna',
    upazilas: [
      { en: 'Chuadanga Sadar', bn: 'চুয়াডাঙ্গা সদর' },
      { en: 'Alamdanga', bn: 'আলমডাঙ্গা' },
      { en: 'Damurhuda', bn: 'দামুড়হুদা' },
      { en: 'Jibannagar', bn: 'জীবননগর' },
    ],
  },
  {
    name: 'Meherpur',
    bnName: 'মেহেরপুর',
    division: 'Khulna',
    upazilas: [
      { en: 'Meherpur Sadar', bn: 'মেহেরপুর সদর' },
      { en: 'Gangni', bn: 'গাংনী' },
      { en: 'Mujibnagar', bn: 'মুজিবনগর' },
    ],
  },
  {
    name: 'Narail',
    bnName: 'নড়াইল',
    division: 'Khulna',
    upazilas: [
      { en: 'Narail Sadar', bn: 'নড়াইল সদর' },
      { en: 'Lohagara', bn: 'লোহাগাড়া' },
      { en: 'Kalia', bn: 'কালিয়া' },
    ],
  },
  {
    name: 'Magura',
    bnName: 'মাগুরা',
    division: 'Khulna',
    upazilas: [
      { en: 'Magura Sadar', bn: 'মাগুরা সদর' },
      { en: 'Sreepur', bn: 'শ্রীপুর' },
      { en: 'Shalikha', bn: 'শালিখা' },
      { en: 'Mohammadpur', bn: 'মোহাম্মদপুর' },
    ],
  },

  // Barishal Division
  {
    name: 'Barishal',
    bnName: 'বরিশাল',
    division: 'Barishal',
    upazilas: [
      { en: 'Barishal Sadar', bn: 'বরিশাল সদর' },
      { en: 'Babuganj', bn: 'বাবুগঞ্জ' },
      { en: 'Gournadi', bn: 'গৌরনদী' },
      { en: 'Agailjhara', bn: 'আগৈলঝাড়া' },
      { en: 'Wazirpur', bn: 'উজিরপুর' },
      { en: 'Banaripara', bn: 'বানারীপাড়া' },
      { en: 'Bakerganj', bn: 'বাকেরগঞ্জ' },
      { en: 'Muladi', bn: 'মুলাদী' },
      { en: 'Hizla', bn: 'হিজলা' },
      { en: 'Mehendiganj', bn: 'মেহেন্দীগঞ্জ' },
    ],
  },
  {
    name: 'Patuakhali',
    bnName: 'পটুয়াখালী',
    division: 'Barishal',
    upazilas: [
      { en: 'Patuakhali Sadar', bn: 'পটুয়াখালী সদর' },
      { en: 'Galachipa', bn: 'গলাচিপা' },
      { en: 'Kalapara', bn: 'কলাপাড়া' },
      { en: 'Bauphal', bn: 'বাউফল' },
      { en: 'Mirzaganj', bn: 'মির্জাগঞ্জ' },
      { en: 'Dashmina', bn: 'দশমিনা' },
      { en: 'Rangabali', bn: 'রাঙ্গাবালী' },
      { en: 'Dumki', bn: 'দুমকি' },
    ],
  },
  {
    name: 'Bhola',
    bnName: 'ভোলা',
    division: 'Barishal',
    upazilas: [
      { en: 'Bhola Sadar', bn: 'ভোলা সদর' },
      { en: 'Daulatkhan', bn: 'দৌলতখান' },
      { en: 'Borhanuddin', bn: 'বোরহানউদ্দিন' },
      { en: 'Lalmohan', bn: 'লালমোহন' },
      { en: 'Tazumuddin', bn: 'তজুমদ্দিন' },
      { en: 'Char Fasson', bn: 'চরফ্যাশন' },
      { en: 'Monpura', bn: 'মনপুরা' },
    ],
  },
  {
    name: 'Pirojpur',
    bnName: 'পিরোজপুর',
    division: 'Barishal',
    upazilas: [
      { en: 'Pirojpur Sadar', bn: 'পিরোজপুর সদর' },
      { en: 'Bhandaria', bn: 'ভাণ্ডারিয়া' },
      { en: 'Mathbaria', bn: 'মঠবাড়িয়া' },
      { en: 'Kawkhali', bn: 'কাউখালী' },
      { en: 'Nazirpur', bn: 'নাজিরপুর' },
      { en: 'Nesarabad', bn: 'নেছারাবাদ' },
      { en: 'Zianagar (Indurkani)', bn: 'ইন্দুরকানী' },
    ],
  },
  {
    name: 'Barguna',
    bnName: 'বরগুনা',
    division: 'Barishal',
    upazilas: [
      { en: 'Barguna Sadar', bn: 'বরগুনা সদর' },
      { en: 'Amtali', bn: 'আমতলী' },
      { en: 'Patharghata', bn: 'পাথরঘাটা' },
      { en: 'Betagi', bn: 'বেতাগী' },
      { en: 'Bamna', bn: 'বামনা' },
      { en: 'Taltali', bn: 'তালতলী' },
    ],
  },
  {
    name: 'Jhalokati',
    bnName: 'ঝালকাঠি',
    division: 'Barishal',
    upazilas: [
      { en: 'Jhalokati Sadar', bn: 'ঝালকাঠি সদর' },
      { en: 'Nalchity', bn: 'নলছিটি' },
      { en: 'Rajapur', bn: 'রাজাপুর' },
      { en: 'Kathalia', bn: 'কাঠালিয়া' },
    ],
  },

  // Sylhet Division
  {
    name: 'Sylhet',
    bnName: 'সিলেট',
    division: 'Sylhet',
    upazilas: [
      { en: 'Sylhet Sadar', bn: 'সিলেট সদর' },
      { en: 'Beanibazar', bn: 'বিয়ানীবাজার' },
      { en: 'Golapganj', bn: 'গোলাপগঞ্জ' },
      { en: 'Companiganj', bn: 'কোম্পানীগঞ্জ' },
      { en: 'Fenchuganj', bn: 'ফেঞ্চুগঞ্জ' },
      { en: 'Bishwanath', bn: 'বিশ্বনাথ' },
      { en: 'Gowainghat', bn: 'গোয়াইনঘাট' },
      { en: 'Jaintiapur', bn: 'জৈন্তাপুর' },
      { en: 'Kanaighat', bn: 'কানাইঘাট' },
      { en: 'Zakiganj', bn: 'জকিগঞ্জ' },
      { en: 'Dakshin Surma', bn: 'দক্ষিণ সুরমা' },
      { en: 'Osmani Nagar', bn: 'ওসমানী নগর' },
    ],
  },
  {
    name: 'Moulvibazar',
    bnName: 'মৌলভীবাজার',
    division: 'Sylhet',
    upazilas: [
      { en: 'Moulvibazar Sadar', bn: 'মৌলভীবাজার সদর' },
      { en: 'Sreemangal', bn: 'শ্রীমঙ্গল' },
      { en: 'Kulaura', bn: 'কুলাউড়া' },
      { en: 'Rajnagar', bn: 'রাজনগর' },
      { en: 'Kamalganj', bn: 'কমলগঞ্জ' },
      { en: 'Barlekha', bn: 'বড়লেখা' },
      { en: 'Juri', bn: 'জুড়ী' },
    ],
  },
  {
    name: 'Habiganj',
    bnName: 'হবিগঞ্জ',
    division: 'Sylhet',
    upazilas: [
      { en: 'Habiganj Sadar', bn: 'হবিগঞ্জ সদর' },
      { en: 'Nabiganj', bn: 'নবীগঞ্জ' },
      { en: 'Madhabpur', bn: 'মাধবপুর' },
      { en: 'Chunarughat', bn: 'চুনারুঘাট' },
      { en: 'Bahubal', bn: 'বাহুবল' },
      { en: 'Baniachong', bn: 'বানিয়াচং' },
      { en: 'Lakhai', bn: 'লাখাই' },
      { en: 'Ajmiriganj', bn: 'আজমিরীগঞ্জ' },
      { en: 'Shayestaganj', bn: 'শায়েস্তাগঞ্জ' },
    ],
  },
  {
    name: 'Sunamganj',
    bnName: 'সুনামগঞ্জ',
    division: 'Sylhet',
    upazilas: [
      { en: 'Sunamganj Sadar', bn: 'সুনামগঞ্জ সদর' },
      { en: 'Chhatak', bn: 'ছাতক' },
      { en: 'Jagannathpur', bn: 'জগন্নাথপুর' },
      { en: 'Derai', bn: 'দিরাই' },
      { en: 'Tahirpur', bn: 'তাহিরপুর' },
      { en: 'Dharampasha', bn: 'ধর্মপাশা' },
      { en: 'Jamalganj', bn: 'জামালগঞ্জ' },
      { en: 'Shalla', bn: 'শাল্লা' },
      { en: 'Bishwambharpur', bn: 'বিশ্বম্ভরপুর' },
      { en: 'Dowarabazar', bn: 'দোয়ারাবাজার' },
      { en: 'Shantiganj', bn: 'শান্তিগঞ্জ' },
      { en: 'Madhyanagar', bn: 'মধ্যনগর' },
    ],
  },

  // Mymensingh Division
  {
    name: 'Mymensingh',
    bnName: 'ময়মনসিংহ',
    division: 'Mymensingh',
    upazilas: [
      { en: 'Mymensingh Sadar', bn: 'ময়মনসিংহ সদর' },
      { en: 'Muktagachha', bn: 'মুক্তাগাছা' },
      { en: 'Valuka', bn: 'ভালুকা' },
      { en: 'Trishal', bn: 'ত্রিশাল' },
      { en: 'Gauripur', bn: 'গৌরীপুর' },
      { en: 'Ishwarganj', bn: 'ঈশ্বরগঞ্জ' },
      { en: 'Nandail', bn: 'নান্দাইল' },
      { en: 'Phulpur', bn: 'ফুলপুর' },
      { en: 'Haluaghat', bn: 'হালুয়াঘাট' },
      { en: 'Dhobaura', bn: 'ধোবাউড়া' },
      { en: 'Gafargaon', bn: 'গফরগাঁও' },
      { en: 'Bhaluka', bn: 'ভালুকা' },
      { en: 'Tara Khanda', bn: 'তারাকান্দা' },
    ],
  },
  {
    name: 'Jamalpur',
    bnName: 'জামালপুর',
    division: 'Mymensingh',
    upazilas: [
      { en: 'Jamalpur Sadar', bn: 'জামালপুর সদর' },
      { en: 'Melandaha', bn: 'মেলান্দহ' },
      { en: 'Islampur', bn: 'ইসলামপুর' },
      { en: 'Dewanganj', bn: 'দেওয়ানগঞ্জ' },
      { en: 'Sarishabari', bn: 'সরিষাবাড়ী' },
      { en: 'Madarganj', bn: 'মাদারগঞ্জ' },
      { en: 'Bakshiganj', bn: 'বকশীগঞ্জ' },
    ],
  },
  {
    name: 'Netrokona',
    bnName: 'নেত্রকোণা',
    division: 'Mymensingh',
    upazilas: [
      { en: 'Netrokona Sadar', bn: 'নেত্রকোণা সদর' },
      { en: 'Barhatta', bn: 'বারহাট্টা' },
      { en: 'Durgapur', bn: 'দুর্গাপুর' },
      { en: 'Kendua', bn: 'কেন্দুয়া' },
      { en: 'Atpara', bn: 'আটপাড়া' },
      { en: 'Madan', bn: 'মদন' },
      { en: 'Khaliajuri', bn: 'খালিয়াজুড়ি' },
      { en: 'Kalmakanda', bn: 'কলমাকান্দা' },
      { en: 'Mohanganj', bn: 'মোহনগঞ্জ' },
      { en: 'Purbadhala', bn: 'পূর্বধলা' },
    ],
  },
  {
    name: 'Sherpur',
    bnName: 'শেরপুর',
    division: 'Mymensingh',
    upazilas: [
      { en: 'Sherpur Sadar', bn: 'শেরপুর সদর' },
      { en: 'Nalitabari', bn: 'নালিতাবাড়ী' },
      { en: 'Nakla', bn: 'নকলা' },
      { en: 'Jhenaigati', bn: 'ঝিনাইগাতী' },
      { en: 'Sreebardi', bn: 'শ্রীবরদী' },
    ],
  },
];

// Education Boards in Bangladesh
export const EDUCATION_BOARDS = [
  'Dinajpur',
  'Dhaka',
  'Rajshahi',
  'Chattogram',
  'Cumilla',
  'Jashore',
  'Barishal',
  'Sylhet',
  'Mymensingh',
  'Madrasah Board',
  'Technical Board (BTEB)',
  'Cambridge / Edexcel',
  'Other / Equivalent',
];

// Major Universities in Bangladesh
export const UNIVERSITIES = [
  'National University (জাতীয় বিশ্ববিদ্যালয়)',
  'University of Dhaka (ঢাকা বিশ্ববিদ্যালয়)',
  'University of Rajshahi (রাজশাহী বিশ্ববিদ্যালয়)',
  'University of Chittagong (চট্টগ্রাম বিশ্ববিদ্যালয়)',
  'Jahangirnagar University (জাহাঙ্গীরনগর বিশ্ববিদ্যালয়)',
  'Bangladesh Open University (উন্মুক্ত বিশ্ববিদ্যালয়)',
  'Islamic University, Kushtia (ইসলামী বিশ্ববিদ্যালয়)',
  'Hajee Mohammad Danesh Science & Technology University (HSTU)',
  'Begum Rokeya University, Rangpur (বেরোবি)',
  'BUET (বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয়)',
  'RUET / KUET / CUET',
  'Jagannath University (জবি)',
  'Comilla University (কুবি)',
  'Islamic Arabic University (ইসলামি আরবি বিশ্ববিদ্যালয়)',
  'Technical Education Board (BTEB)',
  'Private University (বেসরকারি বিশ্ববিদ্যালয়)',
  'Other / Foreign University',
];

// Passing Years generator: 2026 down to 1980
export const PASSING_YEARS: string[] = Array.from(
  { length: 2026 - 1980 + 1 },
  (_, i) => (2026 - i).toString()
);

// Education Levels and Dynamic Subject / Group Options
export interface ExamConfig {
  label: string;
  exams: string[];
  getGroups: (selectedExam: string) => string[];
}

export const EDUCATION_LEVELS = {
  ssc: {
    levelName: 'S.S.C / Dakhil / Equivalent',
    exams: [
      'S.S.C',
      'Dakhil',
      'S.S.C (Vocational)',
      'O Level',
      'Equivalent',
    ],
    getGroups: (exam: string): string[] => {
      if (exam === 'S.S.C') {
        return ['Science', 'Humanities', 'Business Studies'];
      }
      if (exam === 'Dakhil') {
        return ['General', 'Science', 'Mujabbid', 'Hifzul Quran'];
      }
      if (exam === 'S.S.C (Vocational)') {
        return [
          'Computer & IT',
          'General Electrical Works',
          'Civil Construction',
          'Mechanical',
          'Automobile',
          'Dress Making',
          'Welding & Fabrication',
          'Refrigeration & Air Conditioning',
          'Farm Machinery',
        ];
      }
      if (exam === 'O Level') {
        return ['Science', 'Commerce', 'Arts'];
      }
      return ['General', 'Science', 'Humanities', 'Business Studies'];
    },
  },

  hsc: {
    levelName: 'H.S.C / Alim / Equivalent',
    exams: [
      'H.S.C',
      'Alim',
      'H.S.C (Vocational)',
      'H.S.C (BM / BMT)',
      'Diploma in Engineering',
      'Diploma in Medical / Nursing',
      'A Level',
      'Equivalent',
    ],
    getGroups: (exam: string): string[] => {
      if (exam === 'H.S.C') {
        return ['Science', 'Humanities', 'Business Studies'];
      }
      if (exam === 'Alim') {
        return ['General', 'Science', 'Mujabbid'];
      }
      if (exam === 'H.S.C (BM / BMT)') {
        return [
          'Computer Practice (কম্পিউটার অপারেশন)',
          'Accounting (হিসাববিজ্ঞান)',
          'Secretarial Practice (অফিস ম্যানেজমেন্ট)',
          'Banking & Insurance',
          'Entrepreneurship Development',
        ];
      }
      if (exam === 'H.S.C (Vocational)') {
        return [
          'Computer Operation & Maintenance',
          'Electrical Works & Maintenance',
          'Electronic Control & Communication',
          'Agro Machinery',
          'Civil Drafting with CAD',
        ];
      }
      if (exam === 'Diploma in Engineering') {
        return [
          'Computer Science & Technology',
          'Civil Technology',
          'Electrical Technology',
          'Mechanical Technology',
          'Electronics Technology',
          'Power Technology',
          'Telecommunication Technology',
          'Architecture Technology',
          'Textile Technology',
        ];
      }
      if (exam === 'A Level') {
        return ['Science', 'Commerce', 'Arts'];
      }
      return ['General', 'Science', 'Humanities', 'Business Studies'];
    },
  },

  graduation: {
    levelName: 'Graduation / Degree / Honors',
    exams: [
      'Graduation / Degree / Honors',
      'B.Sc (Hons)',
      'B.Sc (Engineering)',
      'B.A (Hons)',
      'B.S.S (Hons)',
      'B.B.A',
      'B.Com (Hons)',
      'Degree (Pass)',
      'Fazil',
      'L.L.B',
      'MBBS / BDS',
      'Equivalent',
    ],
    getGroups: (exam: string): string[] => {
      if (exam.includes('B.Sc') || exam.includes('Engineering')) {
        return [
          'Computer Science & Engineering (CSE)',
          'Information Technology (IT)',
          'Electrical & Electronic Engineering (EEE)',
          'Civil Engineering',
          'Mathematics',
          'Physics',
          'Chemistry',
          'Botany',
          'Zoology',
          'Statistics',
        ];
      }
      if (exam.includes('B.B.A') || exam.includes('B.Com')) {
        return [
          'Accounting',
          'Management',
          'Finance & Banking',
          'Marketing',
          'Human Resource Management (HRM)',
        ];
      }
      if (exam.includes('B.A') || exam.includes('B.S.S')) {
        return [
          'Bangla',
          'English',
          'Political Science',
          'Economics',
          'Sociology',
          'Social Work',
          'History',
          'Islamic History & Culture',
          'Philosophy',
          'Islamic Studies',
        ];
      }
      if (exam.includes('Pass')) {
        return ['B.A (Pass)', 'B.S.S (Pass)', 'B.Sc (Pass)', 'B.B.S (Pass)'];
      }
      return [
        'Computer Science & Engineering',
        'Bangla',
        'English',
        'Accounting',
        'Management',
        'Economics',
        'Political Science',
        'General / Other',
      ];
    },
  },

  masters: {
    levelName: 'Masters / Equivalent (স্নাতকোত্তর)',
    exams: [
      'Masters',
      'M.Sc',
      'M.A',
      'M.S.S',
      'M.B.A',
      'M.B.S',
      'M.Com',
      'L.L.M',
      'Kamil',
      'M.Ed',
      'Equivalent',
    ],
    getGroups: (exam: string): string[] => {
      if (exam === 'M.Sc') {
        return [
          'Computer Science & Engineering (CSE)',
          'Information & Communication Engineering',
          'Physics',
          'Chemistry',
          'Mathematics',
          'Botany',
          'Zoology',
          'Statistics',
          'Applied Chemistry',
        ];
      }
      if (exam === 'M.B.A' || exam === 'M.B.S' || exam === 'M.Com') {
        return [
          'Accounting & Information Systems',
          'Management Studies',
          'Finance & Banking',
          'Marketing',
          'Human Resource Management (HRM)',
          'General MBA',
        ];
      }
      if (exam === 'M.A' || exam === 'M.S.S') {
        return [
          'Bangla',
          'English',
          'Political Science',
          'Economics',
          'Sociology',
          'Social Work',
          'History',
          'Islamic History & Culture',
          'Islamic Studies',
          'Public Administration',
        ];
      }
      return [
        'Computer Science & Engineering',
        'Bangla',
        'English',
        'Economics',
        'Accounting',
        'Management',
        'Political Science',
        'General / Other',
      ];
    },
  },
};
