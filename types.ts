
export enum UserRole {
  PARTICIPANT = 'PARTICIPANT',
  ORGANIZER = 'ORGANIZER',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum PoolStatus {
  OPEN = 'OPEN',
  AWAITING_PAYMENT = 'AWAITING_PAYMENT',
  CLOSED = 'CLOSED',
  BET_PLACED = 'BET_PLACED',
  AWAITING_RESULT = 'AWAITING_RESULT',
  WINNING = 'WINNING',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  avatarUrl?: string;
}

export interface Pool {
  id: string;
  name: string;
  organizerId: string;
  gameType: string; // Mega-Sena, Lotofácil, etc.
  totalQuotas: number;
  availableQuotas: number;
  pricePerQuota: number;
  status: PoolStatus;
  closingDate: string;
  drawDate: string;
  description: string;
  isPublic: boolean;
  accessCode?: string;
}

export interface Bet {
  id: string;
  poolId: string;
  numbers: number[];
  contestNumber: number;
  proofUrl?: string;
  timestamp: string;
}

export interface Participation {
  id: string;
  userId: string;
  poolId: string;
  quotas: number;
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  paidAt?: string;
}
