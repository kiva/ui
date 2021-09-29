/**
 * Helper function for finding elements by their text content.
 * Useful for situations where the text you are searching for contains formatting elements like <mark> or <em>.
 * Example usage: await findByText(byTextContent('Anchorage, AK'));
 *
 * @param {String} textToFind - textContent to search for
 * @returns {function} that can be passed to *ByText queries to make them search by textContent instead of text
 */
export default function byTextContent(textToFind) {
	return (content, node) => {
		const nodeHasText = node.textContent.trim() === textToFind;
		const childrenDontHaveText = Array.from(node.children).every(
			child => child.textContent.trim() !== textToFind
		);
		return nodeHasText && childrenDontHaveText;
	};
}
