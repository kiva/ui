import { ref } from 'vue';
import Alea from '#src/util/experiment/Alea';

export const STATE_JOURNEY = 'JOURNEY';
export const STATE_EARNED = 'EARNED';
export const STATE_IN_PROGRESS = 'IN_PROGRESS';

export default function useBadgeModal(currentBadge) {
	/**
	 * {
	 *   id: 'badge-id'.
	 *   tiers: [
	 *     {
	 *       target: 2,
	 *       learnMoreUrl: '',
	 *       completedDate: null,
	 *       tierStatement: ""
	 *     }
	 *   ]
	 * }
	 */
	const badge = ref(currentBadge);

	const getTierPositions = () => {
		const MIN_POSITION = 0;
		const MAX_POSITION = 2;
		const positions = [];
		let previousPosition;

		(badge.value.tiers ?? []).forEach((_tier, index) => {
			const randomNumber = Alea(`${badge.value.id}-${index}`)();
			let randomPosition = Math.floor(randomNumber * (MAX_POSITION - MIN_POSITION + 1)) + MIN_POSITION;

			// Ensure subsequent positions are different
			if (randomPosition === previousPosition) {
				randomPosition += 1;
				if (randomPosition > MAX_POSITION) randomPosition = MIN_POSITION;
			}

			positions.push(randomPosition);
			previousPosition = randomNumber;
		});

		return positions;
	};

	return { getTierPositions };
}
