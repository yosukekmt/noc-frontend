export type Coupon = {
  id: string;
  rewardType: "gas_fee_cashback";
  name: string;
  description: string;
  contractAddress: string;
  nftTokenId: string;
  treasuryAddress: string;
  timezone: string;
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

export type Nft = {
  id: string;
  contractAddress: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
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
