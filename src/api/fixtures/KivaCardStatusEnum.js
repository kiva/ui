// Mirrors the KivaCardStatusEnum GraphQL enum (redemption-code lifecycle status).
export const ACTIVE = 'active';
export const REDEEMED = 'redeemed';
export const EXPIRED = 'expired';
export const CANCELLED = 'cancelled';

const KivaCardStatusEnum = {
	ACTIVE,
	REDEEMED,
	EXPIRED,
	CANCELLED,
};

export default KivaCardStatusEnum;
