import client from './client';

export interface Expert {
  id: string;
  name: string;
  title: string;
  level: 'GA Leader' | 'GA3 Leader' | 'GA2 Leader';
  rating: number;
  avatarUrl: string;
  specialties: string[];
  description: string;
  experience: string;
  sessionDuration: number; // in minutes
  price: number;
  commission: number; // percentage for affiliate
  availability: TimeSlot[];
  stats: {
    totalSessions: number;
    averageRating: number;
    responseTime: string;
  };
}

export interface TimeSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
  timezone: string;
}

export interface BookingRequest {
  expertId: string;
  timeSlotId: string;
  customerInfo: {
    name: string;
    email: string;
  };
  paymentInfo: {
    cardNumber: string;
    expiryDate: string;
    cvc: string;
    cardholderName: string;
  };
  affiliateId?: string;
}

export interface Booking {
  id: string;
  expertId: string;
  timeSlotId: string;
  customerInfo: {
    name: string;
    email: string;
  };
  amount: number;
  commission: number;
  affiliateCommission: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  meetingLink: string;
  createdAt: string;
}

// Mock data for development
const mockExperts: Expert[] = [
  {
    id: 'john-smith',
    name: 'John Smith',
    title: 'Sales Expert',
    level: 'GA Leader',
    rating: 5.0,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    specialties: ['High-ticket closing', 'Team building', 'Sales strategies'],
    description: 'Sales expert with 10+ years experience. Specializes in high-ticket closing and team building strategies.',
    experience: '10+ years',
    sessionDuration: 60,
    price: 299,
    commission: 25, // 25% to platform, 75% to expert
    stats: {
      totalSessions: 847,
      averageRating: 4.9,
      responseTime: '< 2 hours'
    },
    availability: [
      { id: 'slot-1', date: '2025-08-17', time: '2:00 PM EST', available: true, timezone: 'EST' },
      { id: 'slot-2', date: '2025-08-17', time: '4:30 PM EST', available: true, timezone: 'EST' },
      { id: 'slot-3', date: '2025-08-18', time: '10:00 AM EST', available: true, timezone: 'EST' },
      { id: 'slot-4', date: '2025-08-18', time: '2:30 PM EST', available: true, timezone: 'EST' }
    ]
  },
  {
    id: 'sarah-johnson',
    name: 'Sarah Johnson',
    title: 'Marketing Genius',
    level: 'GA3 Leader',
    rating: 5.0,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    specialties: ['Social media growth', 'Content strategy', '7-figure funnels'],
    description: 'Marketing genius focusing on social media growth and content strategy. Built multiple 7-figure funnels.',
    experience: '8+ years',
    sessionDuration: 60,
    price: 399,
    commission: 25,
    stats: {
      totalSessions: 623,
      averageRating: 4.95,
      responseTime: '< 1 hour'
    },
    availability: [
      { id: 'slot-5', date: '2025-08-17', time: '1:00 PM EST', available: true, timezone: 'EST' },
      { id: 'slot-6', date: '2025-08-17', time: '3:30 PM EST', available: true, timezone: 'EST' },
      { id: 'slot-7', date: '2025-08-18', time: '11:00 AM EST', available: true, timezone: 'EST' },
      { id: 'slot-8', date: '2025-08-18', time: '4:00 PM EST', available: true, timezone: 'EST' }
    ]
  },
  {
    id: 'mike-davis',
    name: 'Mike Davis',
    title: 'Lead Generation Specialist',
    level: 'GA Leader',
    rating: 5.0,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    specialties: ['Paid advertising', 'Conversion optimization', 'Lead generation'],
    description: 'Lead generation specialist with expertise in paid advertising and conversion optimization.',
    experience: '7+ years',
    sessionDuration: 60,
    price: 349,
    commission: 25,
    stats: {
      totalSessions: 456,
      averageRating: 4.9,
      responseTime: '< 3 hours'
    },
    availability: [
      { id: 'slot-9', date: '2025-08-17', time: '12:00 PM EST', available: true, timezone: 'EST' },
      { id: 'slot-10', date: '2025-08-17', time: '5:00 PM EST', available: true, timezone: 'EST' },
      { id: 'slot-11', date: '2025-08-18', time: '9:00 AM EST', available: true, timezone: 'EST' },
      { id: 'slot-12', date: '2025-08-18', time: '3:00 PM EST', available: true, timezone: 'EST' }
    ]
  },
  {
    id: 'lisa-chen',
    name: 'Lisa Chen',
    title: 'Mindset & Personal Development',
    level: 'GA3 Leader',
    rating: 5.0,
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    specialties: ['Mindset coaching', 'Limiting beliefs', 'Scale faster'],
    description: 'Mindset and personal development coach. Helps entrepreneurs overcome limiting beliefs and scale faster.',
    experience: '12+ years',
    sessionDuration: 60,
    price: 275,
    commission: 25,
    stats: {
      totalSessions: 1024,
      averageRating: 4.98,
      responseTime: '< 30 minutes'
    },
    availability: [
      { id: 'slot-13', date: '2025-08-17', time: '11:00 AM EST', available: true, timezone: 'EST' },
      { id: 'slot-14', date: '2025-08-17', time: '6:00 PM EST', available: true, timezone: 'EST' },
      { id: 'slot-15', date: '2025-08-18', time: '1:00 PM EST', available: true, timezone: 'EST' },
      { id: 'slot-16', date: '2025-08-18', time: '5:30 PM EST', available: true, timezone: 'EST' }
    ]
  },
  {
    id: 'robert-wilson',
    name: 'Robert Wilson',
    title: 'Systems & Automation Expert',
    level: 'GA Leader',
    rating: 5.0,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    specialties: ['Business systems', 'Automation', 'Efficiency'],
    description: 'Systems and automation expert. Helps businesses streamline operations and increase efficiency.',
    experience: '9+ years',
    sessionDuration: 60,
    price: 325,
    commission: 25,
    stats: {
      totalSessions: 578,
      averageRating: 4.92,
      responseTime: '< 4 hours'
    },
    availability: [
      { id: 'slot-17', date: '2025-08-17', time: '10:30 AM EST', available: true, timezone: 'EST' },
      { id: 'slot-18', date: '2025-08-17', time: '7:00 PM EST', available: true, timezone: 'EST' },
      { id: 'slot-19', date: '2025-08-18', time: '12:30 PM EST', available: true, timezone: 'EST' },
      { id: 'slot-20', date: '2025-08-18', time: '6:30 PM EST', available: true, timezone: 'EST' }
    ]
  },
  {
    id: 'emma-rodriguez',
    name: 'Emma Rodriguez',
    title: 'E-commerce & Dropshipping',
    level: 'GA2 Leader',
    rating: 5.0,
    avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    specialties: ['E-commerce', 'Dropshipping', '6-figure stores'],
    description: 'E-commerce and dropshipping specialist. Built multiple 6-figure online stores from scratch.',
    experience: '6+ years',
    sessionDuration: 60,
    price: 375,
    commission: 25,
    stats: {
      totalSessions: 389,
      averageRating: 4.94,
      responseTime: '< 2 hours'
    },
    availability: [
      { id: 'slot-21', date: '2025-08-17', time: '9:00 AM EST', available: true, timezone: 'EST' },
      { id: 'slot-22', date: '2025-08-17', time: '8:00 PM EST', available: true, timezone: 'EST' },
      { id: 'slot-23', date: '2025-08-18', time: '10:30 AM EST', available: true, timezone: 'EST' },
      { id: 'slot-24', date: '2025-08-18', time: '7:30 PM EST', available: true, timezone: 'EST' }
    ]
  }
];

export const getAllExperts = async (): Promise<Expert[]> => {
  try {
    // Try to fetch from real API first
    const { data } = await client.get('/experts');
    return data;
  } catch (error) {
    // Fall back to mock data for development
    console.warn('Using mock experts data - API not available:', error);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockExperts);
      }, 300);
    });
  }
};

export const getExpert = async (expertId: string): Promise<Expert | null> => {
  try {
    const { data } = await client.get(`/experts/${expertId}`);
    return data;
  } catch (error) {
    console.warn('Using mock expert data for expertId:', expertId);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const expert = mockExperts.find(e => e.id === expertId);
        resolve(expert || null);
      }, 100);
    });
  }
};

export const bookSession = async (booking: BookingRequest): Promise<Booking> => {
  try {
    const { data } = await client.post('/experts/book', booking);
    return data;
  } catch (error) {
    console.warn('Using mock booking response - API not available:', error);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const expert = mockExperts.find(e => e.id === booking.expertId);
        const timeSlot = expert?.availability.find(t => t.id === booking.timeSlotId);
        
        if (!expert || !timeSlot) {
          throw new Error('Expert or time slot not found');
        }
        
        const affiliateCommission = booking.affiliateId ? (expert.price * expert.commission / 100) * 0.1 : 0; // 10% of platform commission goes to affiliate
        
        const mockBooking: Booking = {
          id: `booking-${Date.now()}`,
          expertId: booking.expertId,
          timeSlotId: booking.timeSlotId,
          customerInfo: booking.customerInfo,
          amount: expert.price,
          commission: expert.price * expert.commission / 100,
          affiliateCommission,
          status: 'confirmed',
          meetingLink: `https://calendly.com/johnsmith-digitalera?date=${timeSlot.date}&time=${timeSlot.time}`,
          createdAt: new Date().toISOString()
        };
        
        resolve(mockBooking);
      }, 1000);
    });
  }
};

export const getAvailableSlots = async (expertId: string, date: string): Promise<TimeSlot[]> => {
  try {
    const { data } = await client.get(`/experts/${expertId}/availability?date=${date}`);
    return data;
  } catch (error) {
    console.warn('Using mock availability data for expert:', expertId);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const expert = mockExperts.find(e => e.id === expertId);
        const slots = expert?.availability.filter(slot => slot.date === date && slot.available) || [];
        resolve(slots);
      }, 200);
    });
  }
};