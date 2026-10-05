export type Language = 'ar' | 'fr';

export interface Wilaya {
  code: string;
  nameAr: string;
  nameFr: string;
  communes: string[];
}

export interface CraftCategory {
  id: string;
  nameAr: string;
  nameFr: string;
  iconName: string;
  descriptionAr: string;
  descriptionFr: string;
  averageRateHourDzd: number;
  averageRateDayDzd: number;
}

export interface Review {
  id: string;
  authorName: string;
  wilaya: string;
  rating: number;
  date: string;
  comment: string;
  verifiedBooking: boolean;
}

export interface Artisan {
  id: string;
  name: string;
  craftId: string;
  craftNameAr: string;
  craftNameFr: string;
  wilayaCode: string;
  wilayaNameAr: string;
  wilayaNameFr: string;
  commune: string;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  phone: string;
  whatsapp: string;
  yearsExperience: number;
  verifiedCAM: boolean;
  insuranceVerified: boolean;
  isAvailableEmergency: boolean;
  avatarUrl: string;
  portfolioImages: string[];
  hourlyRateDzd: number;
  dailyRateDzd: number;
  bioAr: string;
  bioFr: string;
  skills: string[];
  reviews: Review[];
}

export interface EstimateItem {
  id: string;
  trade: string;
  titleAr: string;
  titleFr: string;
  unit: string;
  laborRateDzd: number;
  materialsRateDzd: number;
  minQuantity: number;
  defaultQuantity: number;
}

export interface BookingRequest {
  id: string;
  artisanId: string;
  artisanName: string;
  clientName: string;
  clientPhone: string;
  wilaya: string;
  commune: string;
  address: string;
  serviceType: string;
  scheduledDate: string;
  preferredTime: string;
  description: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface EmergencyRequest {
  id: string;
  clientName: string;
  clientPhone: string;
  wilayaCode: string;
  problemType: 'water_leak' | 'electrical_outage' | 'gas_lock' | 'locksmith';
  urgentNotes: string;
  status: 'searching' | 'assigned' | 'en_route' | 'resolved';
  createdAt: string;
}