export type CouponStatus =
  | "processing"
  | "scheduled"
  | "ongoing"
  | "finished"
  | "failed"
  | "invalidated";
export type CouponRewardType = "cashback_gas" | "cashback_005";

export type PageInfo = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export type Coupon = {
  id: string;
  rewardType: CouponRewardType;
  name: string;
  description: string;
  imageUrl: string;
  contractAddress: string;
  nftTokenId: string;
  timezone: string;
  startAt: Date;
  endAt: Date;
  createdAt: Date;
  updatedAt: Date;
  invalidatedAt: Date;
  chainId: number;
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
  walletAddress: string;
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Nft = {
  id: string;
  contractAddress: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  chainId: number;
};

export type NftTransfer = {
  id: string;
  txHash: string;
  fromAddress: string | null;
  toAddress: string | null;
  valueWei: string | null;
  gasPrice: string | null;
  gasLimit: string | null;
  blockProducedAt: Date;
  nftId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CouponHolder = {
  id: string;
  walletAddress: string;
  couponId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Cashback = {
  id: string;
  treasuryAddress: string;
  walletAddress: string;
  amountWei: number;
  txHash: string;
  couponId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Chain = {
  id: number;
  name: string;
  explorerUrl: string;
  openseaUrl: string;
};

export type CouponTransfer = {
  id: string;
  walletAddress: string;
  txHash: string;
  couponId: string;
  succeededAt: Date;
  failedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};
