export interface DistrictItem {
  name: string;
  bnName: string;
  division: string;
  coordinates?: { lat: number; lng: number };
}

export const BANGLADESH_DIVISIONS = [
  'Dhaka',
  'Chittagong',
  'Rajshahi',
  'Khulna',
  'Barisal',
  'Sylhet',
  'Rangpur',
  'Mymensingh',
] as const;

export const BANGLADESH_DISTRICTS: DistrictItem[] = [
  // Dhaka Division (13)
  { name: 'Dhaka', bnName: 'ঢাকা', division: 'Dhaka', coordinates: { lat: 23.8103, lng: 90.4125 } },
  { name: 'Gazipur', bnName: 'গাজীপুর', division: 'Dhaka', coordinates: { lat: 23.9999, lng: 90.4203 } },
  { name: 'Narayanganj', bnName: 'নারায়ণগঞ্জ', division: 'Dhaka', coordinates: { lat: 23.6238, lng: 90.5000 } },
  { name: 'Narsingdi', bnName: 'নরসিংদী', division: 'Dhaka', coordinates: { lat: 23.9322, lng: 90.7154 } },
  { name: 'Tangail', bnName: 'টাঙ্গাইল', division: 'Dhaka', coordinates: { lat: 24.2513, lng: 89.9167 } },
  { name: 'Kishoreganj', bnName: 'কিশোরগঞ্জ', division: 'Dhaka', coordinates: { lat: 24.4449, lng: 90.7766 } },
  { name: 'Manikganj', bnName: 'মানিকগঞ্জ', division: 'Dhaka', coordinates: { lat: 23.8617, lng: 90.0003 } },
  { name: 'Munshiganj', bnName: 'মুন্সীগঞ্জ', division: 'Dhaka', coordinates: { lat: 23.5422, lng: 90.5305 } },
  { name: 'Faridpur', bnName: 'ফরিদপুর', division: 'Dhaka', coordinates: { lat: 23.6071, lng: 89.8429 } },
  { name: 'Gopalganj', bnName: 'গোপালগঞ্জ', division: 'Dhaka', coordinates: { lat: 23.0051, lng: 89.8266 } },
  { name: 'Madaripur', bnName: 'মাদারীপুর', division: 'Dhaka', coordinates: { lat: 23.1641, lng: 90.1897 } },
  { name: 'Rajbari', bnName: 'রাজবাড়ী', division: 'Dhaka', coordinates: { lat: 23.7574, lng: 89.6445 } },
  { name: 'Shariatpur', bnName: 'শরীয়তপুর', division: 'Dhaka', coordinates: { lat: 23.2423, lng: 90.4348 } },

  // Chittagong Division (11)
  { name: 'Chittagong', bnName: 'চট্টগ্রাম', division: 'Chittagong', coordinates: { lat: 22.3569, lng: 91.7832 } },
  { name: "Cox's Bazar", bnName: 'কক্সবাজার', division: 'Chittagong', coordinates: { lat: 21.4272, lng: 92.0058 } },
  { name: 'Cumilla', bnName: 'কুমিল্লা', division: 'Chittagong', coordinates: { lat: 23.4607, lng: 91.1809 } },
  { name: 'Feni', bnName: 'ফেনী', division: 'Chittagong', coordinates: { lat: 23.0159, lng: 91.3976 } },
  { name: 'Brahmanbaria', bnName: 'ব্রাহ্মণবাড়িয়া', division: 'Chittagong', coordinates: { lat: 23.9571, lng: 91.1119 } },
  { name: 'Chandpur', bnName: 'চাঁদপুর', division: 'Chittagong', coordinates: { lat: 23.2333, lng: 90.6667 } },
  { name: 'Noakhali', bnName: 'নোয়াখালী', division: 'Chittagong', coordinates: { lat: 22.8696, lng: 91.0994 } },
  { name: 'Lakshmipur', bnName: 'লক্ষ্মীপুর', division: 'Chittagong', coordinates: { lat: 22.9425, lng: 90.8412 } },
  { name: 'Khagrachhari', bnName: 'খাগড়াছড়ি', division: 'Chittagong', coordinates: { lat: 23.1193, lng: 91.9847 } },
  { name: 'Rangamati', bnName: 'রাঙ্গামাটি', division: 'Chittagong', coordinates: { lat: 22.7324, lng: 92.2985 } },
  { name: 'Bandarban', bnName: 'বান্দরবান', division: 'Chittagong', coordinates: { lat: 22.1953, lng: 92.2184 } },

  // Rajshahi Division (8)
  { name: 'Rajshahi', bnName: 'রাজশাহী', division: 'Rajshahi', coordinates: { lat: 24.3745, lng: 88.6042 } },
  { name: 'Bogura', bnName: 'বগুড়া', division: 'Rajshahi', coordinates: { lat: 24.8465, lng: 89.3777 } },
  { name: 'Pabna', bnName: 'পাবনা', division: 'Rajshahi', coordinates: { lat: 24.0064, lng: 89.2372 } },
  { name: 'Sirajganj', bnName: 'সিরাজগঞ্জ', division: 'Rajshahi', coordinates: { lat: 24.4534, lng: 89.7008 } },
  { name: 'Naogaon', bnName: 'নওগাঁ', division: 'Rajshahi', coordinates: { lat: 24.7937, lng: 88.9318 } },
  { name: 'Natore', bnName: 'নাটোর', division: 'Rajshahi', coordinates: { lat: 24.4206, lng: 89.0003 } },
  { name: 'Chapainawabganj', bnName: 'চাঁপাইনবাবগঞ্জ', division: 'Rajshahi', coordinates: { lat: 24.5965, lng: 88.2776 } },
  { name: 'Joypurhat', bnName: 'জয়পুরহাট', division: 'Rajshahi', coordinates: { lat: 25.1015, lng: 89.0277 } },

  // Khulna Division (10)
  { name: 'Khulna', bnName: 'খুলনা', division: 'Khulna', coordinates: { lat: 22.8456, lng: 89.5403 } },
  { name: 'Jashore', bnName: 'যশোর', division: 'Khulna', coordinates: { lat: 23.1664, lng: 89.2182 } },
  { name: 'Kushtia', bnName: 'কুষ্টিয়া', division: 'Khulna', coordinates: { lat: 23.9013, lng: 89.1205 } },
  { name: 'Satkhira', bnName: 'সাতক্ষীরা', division: 'Khulna', coordinates: { lat: 22.7185, lng: 89.0705 } },
  { name: 'Bagerhat', bnName: 'বাগেরহাট', division: 'Khulna', coordinates: { lat: 22.6516, lng: 89.7859 } },
  { name: 'Jhenaidah', bnName: 'ঝিনাইদহ', division: 'Khulna', coordinates: { lat: 23.5448, lng: 89.1539 } },
  { name: 'Chuadanga', bnName: 'চুয়াডাঙ্গা', division: 'Khulna', coordinates: { lat: 23.6402, lng: 88.8418 } },
  { name: 'Magura', bnName: 'মাগুরা', division: 'Khulna', coordinates: { lat: 23.4873, lng: 89.4198 } },
  { name: 'Meherpur', bnName: 'মেহেরপুর', division: 'Khulna', coordinates: { lat: 23.7622, lng: 88.6318 } },
  { name: 'Narail', bnName: 'নড়াইল', division: 'Khulna', coordinates: { lat: 23.1725, lng: 89.5127 } },

  // Barisal Division (6)
  { name: 'Barisal', bnName: 'বরিশাল', division: 'Barisal', coordinates: { lat: 22.7010, lng: 90.3535 } },
  { name: 'Patuakhali', bnName: 'পটুয়াখালী', division: 'Barisal', coordinates: { lat: 22.3596, lng: 90.3299 } },
  { name: 'Bhola', bnName: 'ভোলা', division: 'Barisal', coordinates: { lat: 22.6859, lng: 90.6481 } },
  { name: 'Pirojpur', bnName: 'পিরোজপুর', division: 'Barisal', coordinates: { lat: 22.5841, lng: 89.9720 } },
  { name: 'Barguna', bnName: 'বরগুনা', division: 'Barisal', coordinates: { lat: 22.0953, lng: 90.0768 } },
  { name: 'Jhalokathi', bnName: 'ঝালকাঠি', division: 'Barisal', coordinates: { lat: 22.6406, lng: 90.1987 } },

  // Sylhet Division (4)
  { name: 'Sylhet', bnName: 'সিলেট', division: 'Sylhet', coordinates: { lat: 24.8949, lng: 91.8687 } },
  { name: 'Moulvibazar', bnName: 'মৌলভীবাজার', division: 'Sylhet', coordinates: { lat: 24.4829, lng: 91.7774 } },
  { name: 'Habiganj', bnName: 'হবিগঞ্জ', division: 'Sylhet', coordinates: { lat: 24.3749, lng: 91.4155 } },
  { name: 'Sunamganj', bnName: 'সুনামগঞ্জ', division: 'Sylhet', coordinates: { lat: 25.0658, lng: 91.3950 } },

  // Rangpur Division (8)
  { name: 'Rangpur', bnName: 'রংপুর', division: 'Rangpur', coordinates: { lat: 25.7439, lng: 89.2752 } },
  { name: 'Dinajpur', bnName: 'দিনাজপুর', division: 'Rangpur', coordinates: { lat: 25.6217, lng: 88.6355 } },
  { name: 'Gaibandha', bnName: 'গাইবান্ধা', division: 'Rangpur', coordinates: { lat: 25.3288, lng: 89.5403 } },
  { name: 'Kurigram', bnName: 'কুড়িগ্রাম', division: 'Rangpur', coordinates: { lat: 25.8054, lng: 89.6362 } },
  { name: 'Lalmonirhat', bnName: 'লালমনিরহাট', division: 'Rangpur', coordinates: { lat: 25.9923, lng: 89.2847 } },
  { name: 'Nilphamari', bnName: 'নীলফামারী', division: 'Rangpur', coordinates: { lat: 25.9318, lng: 88.8560 } },
  { name: 'Panchagarh', bnName: 'পঞ্চগড়', division: 'Rangpur', coordinates: { lat: 26.3411, lng: 88.5542 } },
  { name: 'Thakurgaon', bnName: 'ঠাকুরগাঁও', division: 'Rangpur', coordinates: { lat: 26.0337, lng: 88.4617 } },

  // Mymensingh Division (4)
  { name: 'Mymensingh', bnName: 'ময়মনসিংহ', division: 'Mymensingh', coordinates: { lat: 24.7471, lng: 90.4203 } },
  { name: 'Jamalpur', bnName: 'জামালপুর', division: 'Mymensingh', coordinates: { lat: 24.9375, lng: 89.9378 } },
  { name: 'Netrokona', bnName: 'নেত্রকোণা', division: 'Mymensingh', coordinates: { lat: 24.8709, lng: 90.7279 } },
  { name: 'Sherpur', bnName: 'শেরপুর', division: 'Mymensingh', coordinates: { lat: 25.0205, lng: 90.0153 } },
];

/**
 * Returns all 64 district names sorted alphabetically
 */
export const ALL_DISTRICT_NAMES = BANGLADESH_DISTRICTS.map((d) => d.name).sort();

/**
 * Common major hub cities sorted by event volume
 */
export const POPULAR_DISTRICTS = [
  'Dhaka',
  'Chittagong',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barisal',
  'Rangpur',
  'Mymensingh',
  'Gazipur',
  "Cox's Bazar",
  'Cumilla',
];
