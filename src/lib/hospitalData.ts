import type { HospitalInfo, CityInfo, Ward } from '@/lib/types';

export const CITIES: CityInfo[] = [
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9525 },
  { name: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198 },
  { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { name: 'Mysuru', state: 'Karnataka', lat: 12.2958, lng: 76.6394 },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185 },
  { name: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673 },
  { name: 'Thiruvananthapuram', state: 'Kerala', lat: 8.5241, lng: 76.9366 },
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882 },
  { name: 'Delhi', state: 'Delhi NCR', lat: 28.7041, lng: 77.1025 },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  { name: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311 },
  { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
  { name: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376 },
  { name: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lng: 85.8245 },
  { name: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362 },
  { name: 'Chandigarh', state: 'Punjab', lat: 30.7333, lng: 76.7794 },
  { name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
];

const WARD_TEMPLATES = [
  { name: 'Emergency', shortName: 'ER', icon: 'Activity' as const, bedRatio: 0.25 },
  { name: 'ICU', shortName: 'ICU', icon: 'HeartPulse' as const, bedRatio: 0.15 },
  { name: 'General Ward', shortName: 'GEN', icon: 'Hospital' as const, bedRatio: 0.30 },
  { name: 'Trauma Unit', shortName: 'TRM', icon: 'ShieldAlert' as const, bedRatio: 0.12 },
  { name: 'Pediatrics', shortName: 'PED', icon: 'Baby' as const, bedRatio: 0.10 },
  { name: 'Cardiac Care', shortName: 'CCU', icon: 'HeartPulse' as const, bedRatio: 0.08 },
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generateWards(hospitalId: string, totalBeds: number, seed: number): Ward[] {
  const rng = seededRandom(seed);
  return WARD_TEMPLATES.map((template, i) => {
    const wardBeds = Math.max(4, Math.round(totalBeds * template.bedRatio));
    const occupancyRate = 0.45 + rng() * 0.5;
    const occupied = Math.round(wardBeds * occupancyRate);
    const history = Array.from({ length: 12 }, () =>
      Math.max(0, Math.round(occupied * (0.7 + rng() * 0.3)))
    );
    const arrivals = Array.from({ length: 12 }, () => Math.round(rng() * 8));
    return {
      id: `${hospitalId}-w${i}`,
      name: template.name,
      shortName: template.shortName,
      totalBeds: wardBeds,
      occupiedBeds: occupied,
      icon: template.icon,
      occupancyHistory: history,
      arrivalsHistory: arrivals,
    };
  });
}

interface HospitalSeed {
  name: string;
  city: string;
  state: string;
  totalBeds: number;
  traumaCenter?: boolean;
  pediatric?: boolean;
  cardiac?: boolean;
  ambulanceBay?: boolean;
}

const HOSPITAL_SEEDS: HospitalSeed[] = [
  // Chennai
  { name: 'Apollo Hospitals', city: 'Chennai', state: 'Tamil Nadu', totalBeds: 600, traumaCenter: true, pediatric: true, cardiac: true, ambulanceBay: true },
  { name: 'Government General Hospital', city: 'Chennai', state: 'Tamil Nadu', totalBeds: 2200, traumaCenter: true, pediatric: true, cardiac: true, ambulanceBay: true },
  { name: 'Sundaram Medical Foundation', city: 'Chennai', state: 'Tamil Nadu', totalBeds: 200, cardiac: true, ambulanceBay: true },
  { name: 'MIOT International', city: 'Chennai', state: 'Tamil Nadu', totalBeds: 1000, traumaCenter: true, pediatric: true, cardiac: true, ambulanceBay: true },
  { name: 'Kauvery Hospital', city: 'Chennai', state: 'Tamil Nadu', totalBeds: 250, cardiac: true, ambulanceBay: true },
  { name: 'Sri Ramachandra Medical Centre', city: 'Chennai', state: 'Tamil Nadu', totalBeds: 1800, traumaCenter: true, pediatric: true, cardiac: true, ambulanceBay: true },

  // Coimbatore
  { name: 'Ganga Hospital', city: 'Coimbatore', state: 'Tamil Nadu', totalBeds: 500, traumaCenter: true, cardiac: true, ambulanceBay: true },
  { name: 'KG Hospital', city: 'Coimbatore', state: 'Tamil Nadu', totalBeds: 550, traumaCenter: true, pediatric: true, cardiac: true, ambulanceBay: true },
  { name: 'PSG Hospitals', city: 'Coimbatore', state: 'Tamil Nadu', totalBeds: 750, pediatric: true, cardiac: true, ambulanceBay: true },
  { name: 'Coimbatore Medical College Hospital', city: 'Coimbatore', state: 'Tamil Nadu', totalBeds: 1050, traumaCenter: true, pediatric: true, ambulanceBay: true },
  { name: 'Sri Ramakrishna Hospital', city: 'Coimbatore', state: 'Tamil Nadu', totalBeds: 700, cardiac: true, pediatric: true, ambulanceBay: true },

  // Madurai
  { name: 'Madurai Meenakshi Mission Hospital', city: 'Madurai', state: 'Tamil Nadu', totalBeds: 500, traumaCenter: true, cardiac: true, ambulanceBay: true },
  { name: 'Government Rajaji Hospital', city: 'Madurai', state: 'Tamil Nadu', totalBeds: 2500, traumaCenter: true, pediatric: true, cardiac: true, ambulanceBay: true },
  { name: 'Vadamalayan Hospital', city: 'Madurai', state: 'Tamil Nadu', totalBeds: 300, cardiac: true, ambulanceBay: true },

  // Bengaluru
  { name: 'Narayana Health City', city: 'Bengaluru', state: 'Karnataka', totalBeds: 1600, traumaCenter: true, pediatric: true, cardiac: true, ambulanceBay: true },
  { name: 'Manipal Hospital Old Airport Road', city: 'Bengaluru', state: 'Karnataka', totalBeds: 700, traumaCenter: true, pediatric: true, cardiac: true, ambulanceBay: true },
  { name: 'Apollo Hospitals Bengaluru', city: 'Bengaluru', state: 'Karnataka', totalBeds: 500, cardiac: true, pediatric: true, ambulanceBay: true },
  { name: 'Fortis Hospital Bannerghatta', city: 'Bengaluru', state: 'Karnataka', totalBeds: 400, cardiac: true, traumaCenter: true, ambulanceBay: true },
  { name: 'BGS Gleneagles Global Hospital', city: 'Bengaluru', state: 'Karnataka', totalBeds: 500, traumaCenter: true, cardiac: true, ambulanceBay: true },

  // Mysuru
  { name: 'JSS Medical College Hospital', city: 'Mysuru', state: 'Karnataka', totalBeds: 1800, traumaCenter: true, pediatric: true, ambulanceBay: true },
  { name: 'Apollo BGS Hospital Mysuru', city: 'Mysuru', state: 'Karnataka', totalBeds: 400, cardiac: true, pediatric: true, ambulanceBay: true },

  // Hyderabad
  { name: 'Nizam\'s Institute of Medical Sciences', city: 'Hyderabad', state: 'Telangana', totalBeds: 1000, traumaCenter: true, cardiac: true, ambulanceBay: true },
  { name: 'Apollo Hospitals Jubilee Hills', city: 'Hyderabad', state: 'Telangana', totalBeds: 550, traumaCenter: true, pediatric: true, cardiac: true, ambulanceBay: true },
  { name: 'Yashoda Hospitals Somajiguda', city: 'Hyderabad', state: 'Telangana', totalBeds: 500, cardiac: true, traumaCenter: true, ambulanceBay: true },
  { name: 'KIMS Hospitals Secunderabad', city: 'Hyderabad', state: 'Telangana', totalBeds: 1000, traumaCenter: true, pediatric: true, cardiac: true, ambulanceBay: true },

  // Visakhapatnam
  { name: 'King George Hospital', city: 'Visakhapatnam', state: 'Andhra Pradesh', totalBeds: 1500, traumaCenter: true, pediatric: true, ambulanceBay: true },
  { name: 'Apollo Hospitals Visakhapatnam', city: 'Visakhapatnam', state: 'Andhra Pradesh', totalBeds: 300, cardiac: true, ambulanceBay: true },

  // Kochi
  { name: 'Amrita Institute of Medical Sciences', city: 'Kochi', state: 'Kerala', totalBeds: 1500, traumaCenter: true, pediatric: true, cardiac: true, ambulanceBay: true },
  { name: 'Aster Medcity', city: 'Kochi', state: 'Kerala', totalBeds: 500, traumaCenter: true, cardiac: true, ambulanceBay: true },
  { name: 'Lakeshore Hospital', city: 'Kochi', state: 'Kerala', totalBeds: 400, cardiac: true, ambulanceBay: true },

  // Thiruvananthapuram
  { name: 'Medical College Hospital Thiruvananthapuram', city: 'Thiruvananthapuram', state: 'Kerala', totalBeds: 3000, traumaCenter: true, pediatric: true, cardiac: true, ambulanceBay: true },
  { name: 'KIMS Healthcare Trivandrum', city: 'Thiruvananthapuram', state: 'Kerala', totalBeds: 400, cardiac: true, ambulanceBay: true },

  // Mumbai
  { name: 'AIIMS Mumbai', city: 'Mumbai', state: 'Maharashtra', totalBeds: 2000, traumaCenter: true, pediatric: true, cardiac: true, ambulanceBay: true },
  { name: 'Lilavati Hospital', city: 'Mumbai', state: 'Maharashtra', totalBeds: 300, cardiac: true, pediatric: true, ambulanceBay: true },
  { name: 'Hinduja Hospital', city: 'Mumbai', state: 'Maharashtra', totalBeds: 750, traumaCenter: true, cardiac: true, ambulanceBay: true },
  { name: 'Bombay Hospital', city: 'Mumbai', state: 'Maharashtra', totalBeds: 1000, traumaCenter: true, pediatric: true, cardiac: true, ambulanceBay: true },
  { name: 'Kokilaben Dhirubhai Ambani Hospital', city: 'Mumbai', state: 'Maharashtra', totalBeds: 750, traumaCenter: true, pediatric: true, cardiac: true, ambulanceBay: true },
  { name: 'Nair Hospital', city: 'Mumbai', state: 'Maharashtra', totalBeds: 1800, traumaCenter: true, pediatric: true, ambulanceBay: true },

  // Pune
  { name: 'Ruby Hall Clinic', city: 'Pune', state: 'Maharashtra', totalBeds: 700, traumaCenter: true, cardiac: true, ambulanceBay: true },
  { name: 'Sahyadri Hospital', city: 'Pune', state: 'Maharashtra', totalBeds: 500, cardiac: true, pediatric: true, ambulanceBay: true },
  { name: 'Deenanath Mangeshkar Hospital', city: 'Pune', state: 'Maharashtra', totalBeds: 900, traumaCenter: true, cardiac: true, ambulanceBay: true },

  // Nagpur
  { name: 'AIIMS Nagpur', city: 'Nagpur', state: 'Maharashtra', totalBeds: 1000, traumaCenter: true, pediatric: true, ambulanceBay: true },
  { name: 'Wockhardt Hospital Nagpur', city: 'Nagpur', state: 'Maharashtra', totalBeds: 300, cardiac: true, ambulanceBay: true },

  // Delhi
  { name: 'AIIMS Delhi', city: 'Delhi', state: 'Delhi NCR', totalBeds: 2800, traumaCenter: true, pediatric: true, cardiac: true, ambulanceBay: true },
  { name: 'Safdarjung Hospital', city: 'Delhi', state: 'Delhi NCR', totalBeds: 2900, traumaCenter: true, pediatric: true, cardiac: true, ambulanceBay: true },
  { name: 'Apollo Hospital Delhi', city: 'Delhi', state: 'Delhi NCR', totalBeds: 700, traumaCenter: true, cardiac: true, ambulanceBay: true },
  { name: 'Max Super Speciality Saket', city: 'Delhi', state: 'Delhi NCR', totalBeds: 530, traumaCenter: true, pediatric: true, cardiac: true, ambulanceBay: true },
  { name: 'Fortis Escorts Heart Institute', city: 'Delhi', state: 'Delhi NCR', totalBeds: 300, cardiac: true, ambulanceBay: true },
  { name: 'Sir Ganga Ram Hospital', city: 'Delhi', state: 'Delhi NCR', totalBeds: 675, traumaCenter: true, pediatric: true, cardiac: true, ambulanceBay: true },

  // Jaipur
  { name: 'SMS Medical College Hospital', city: 'Jaipur', state: 'Rajasthan', totalBeds: 2500, traumaCenter: true, pediatric: true, cardiac: true, ambulanceBay: true },
  { name: 'Fortis Escorts Hospital Jaipur', city: 'Jaipur', state: 'Rajasthan', totalBeds: 300, cardiac: true, ambulanceBay: true },

  // Kolkata
  { name: 'AIIMS Kolkata', city: 'Kolkata', state: 'West Bengal', totalBeds: 1500, traumaCenter: true, pediatric: true, cardiac: true, ambulanceBay: true },
  { name: 'Apollo Gleneagles Hospital', city: 'Kolkata', state: 'West Bengal', totalBeds: 500, traumaCenter: true, cardiac: true, ambulanceBay: true },
  { name: 'AMRI Hospitals', city: 'Kolkata', state: 'West Bengal', totalBeds: 700, traumaCenter: true, pediatric: true, ambulanceBay: true },
  { name: 'CMC Hospital Vellore', city: 'Kolkata', state: 'West Bengal', totalBeds: 400, cardiac: true, ambulanceBay: true },

  // Ahmedabad
  { name: 'Zydus Hospital Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', totalBeds: 550, traumaCenter: true, cardiac: true, ambulanceBay: true },
  { name: 'Sterling Hospital', city: 'Ahmedabad', state: 'Gujarat', totalBeds: 400, cardiac: true, pediatric: true, ambulanceBay: true },
  { name: 'Civil Hospital Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', totalBeds: 2500, traumaCenter: true, pediatric: true, ambulanceBay: true },

  // Surat
  { name: 'Surat Municipal Hospital', city: 'Surat', state: 'Gujarat', totalBeds: 1200, traumaCenter: true, pediatric: true, ambulanceBay: true },
  { name: 'Sunshine Global Hospital Surat', city: 'Surat', state: 'Gujarat', totalBeds: 350, cardiac: true, ambulanceBay: true },

  // Lucknow
  { name: 'SGPGI Lucknow', city: 'Lucknow', state: 'Uttar Pradesh', totalBeds: 1000, traumaCenter: true, pediatric: true, cardiac: true, ambulanceBay: true },
  { name: 'Apollo Medics Hospital Lucknow', city: 'Lucknow', state: 'Uttar Pradesh', totalBeds: 500, cardiac: true, ambulanceBay: true },

  // Bhopal
  { name: 'AIIMS Bhopal', city: 'Bhopal', state: 'Madhya Pradesh', totalBeds: 1000, traumaCenter: true, pediatric: true, ambulanceBay: true },
  { name: 'Bansal Hospital Bhopal', city: 'Bhopal', state: 'Madhya Pradesh', totalBeds: 400, cardiac: true, ambulanceBay: true },

  // Patna
  { name: 'AIIMS Patna', city: 'Patna', state: 'Bihar', totalBeds: 1000, traumaCenter: true, pediatric: true, cardiac: true, ambulanceBay: true },
  { name: 'Ruban Hospital Patna', city: 'Patna', state: 'Bihar', totalBeds: 300, cardiac: true, ambulanceBay: true },

  // Bhubaneswar
  { name: 'AIIMS Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', totalBeds: 1000, traumaCenter: true, pediatric: true, cardiac: true, ambulanceBay: true },
  { name: 'Apollo Hospitals Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', totalBeds: 400, cardiac: true, ambulanceBay: true },

  // Guwahati
  { name: 'AIIMS Guwahati', city: 'Guwahati', state: 'Assam', totalBeds: 1000, traumaCenter: true, pediatric: true, ambulanceBay: true },
  { name: 'Apollo Hospitals Guwahati', city: 'Guwahati', state: 'Assam', totalBeds: 350, cardiac: true, ambulanceBay: true },

  // Chandigarh
  { name: 'PGI Chandigarh', city: 'Chandigarh', state: 'Punjab', totalBeds: 2000, traumaCenter: true, pediatric: true, cardiac: true, ambulanceBay: true },
  { name: 'Fortis Hospital Mohali', city: 'Chandigarh', state: 'Punjab', totalBeds: 400, cardiac: true, ambulanceBay: true },

  // Indore
  { name: 'Bombay Hospital Indore', city: 'Indore', state: 'Madhya Pradesh', totalBeds: 500, traumaCenter: true, cardiac: true, ambulanceBay: true },
  { name: 'Choithram Hospital Indore', city: 'Indore', state: 'Madhya Pradesh', totalBeds: 400, pediatric: true, ambulanceBay: true },
];

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getHospitalsForCity(cityName: string, includeNearby = true): HospitalInfo[] {
  const city = CITIES.find((c) => c.name === cityName);
  if (!city) return [];

  const inCity = HOSPITAL_SEEDS.filter((h) => h.city === cityName);
  const nearby = includeNearby
    ? HOSPITAL_SEEDS.filter((h) => h.city !== cityName)
    : [];

  const nearbyWithDistance = nearby
    .map((h) => {
      const hospitalCity = CITIES.find((c) => c.name === h.city);
      if (!hospitalCity) return null;
      const dist = haversineKm(city.lat, city.lng, hospitalCity.lat, hospitalCity.lng);
      return { hospital: h, distance: dist };
    })
    .filter((x): x is { hospital: HospitalSeed; distance: number } => x !== null)
    .filter((x) => x.distance <= 200)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 6);

  const all = [...inCity, ...nearbyWithDistance.map((x) => x.hospital)];

  return all.map((seed, idx) => {
    const hospitalId = `${seed.city}-${idx}`;
    const wards = generateWards(hospitalId, seed.totalBeds, idx * 1000 + seed.name.length);
    const totalBeds = wards.reduce((s, w) => s + w.totalBeds, 0);
    const occupiedBeds = wards.reduce((s, w) => s + w.occupiedBeds, 0);
    const emergencyWard = wards.find((w) => w.name === 'Emergency');
    const icuWard = wards.find((w) => w.name === 'ICU');
    const hospitalCity = CITIES.find((c) => c.name === seed.city);
    const offsetLat = ((idx % 3) - 1) * 0.025 + (idx * 0.006);
    const offsetLng = (((idx + 1) % 3) - 1) * 0.025 - (idx * 0.005);
    const hLat = Number(((hospitalCity?.lat ?? city.lat) + offsetLat).toFixed(4));
    const hLng = Number(((hospitalCity?.lng ?? city.lng) + offsetLng).toFixed(4));

    const rawDist = haversineKm(city.lat, city.lng, hLat, hLng);
    const distance = Number((rawDist > 0.5 ? rawDist : (3.5 + idx * 1.8)).toFixed(1));
    const eta = Math.max(5, Math.round(distance * 2.2));
    const ventilators = Math.round((icuWard?.totalBeds ?? 0) * 0.6);

    return {
      id: hospitalId,
      name: seed.name,
      city: seed.city,
      state: seed.state,
      lat: hLat,
      lng: hLng,
      totalBeds,
      occupiedBeds,
      emergencyBeds: emergencyWard?.totalBeds ?? 0,
      icuBeds: icuWard?.totalBeds ?? 0,
      ventilators,
      ambulanceBay: seed.ambulanceBay ?? false,
      traumaCenter: seed.traumaCenter ?? false,
      pediatric: seed.pediatric ?? false,
      cardiac: seed.cardiac ?? false,
      distanceKm: distance,
      etaMinutes: eta,
      wards,
      lastUpdated: Date.now() - Math.floor(Math.random() * 60000),
    };
  });
}

export function getCityByName(name: string): CityInfo | undefined {
  return CITIES.find((c) => c.name === name);
}

export function searchCities(query: string): CityInfo[] {
  if (!query.trim()) return CITIES;
  const q = query.toLowerCase();
  return CITIES.filter(
    (c) => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)
  );
}
