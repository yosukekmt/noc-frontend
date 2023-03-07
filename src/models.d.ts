export type Coupon = {
  id: string;
  rewardType: "gas_fee_cashback";
  name: string;
  description: string;
  contractAddress: string;
  treasuryAddress: string;
  startAt: Date;
  endAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type Invitation = {
  id: string;
  email: string;
  sentAt: Date | null;
  acceptedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Project = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};