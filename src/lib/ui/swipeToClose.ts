export function swipeToClose(node: HTMLElement) {
	let touchStartY: number;
	let initialHeight: number;
	let rafId: number;

	const updateModalTransform = (y: number) => {
		cancelAnimationFrame(rafId);
		rafId = requestAnimationFrame(() => {
			const progress = Math.max(0, Math.min(1, y / initialHeight));
			const scale = 1 - progress * 0.1; // Scale down as you swipe up
			node.style.transform = `translateY(${y}px) scale(${scale})`;
			node.style.opacity = `${1 - progress}`;
		});
	};

	const handleTouchStart = (e: TouchEvent) => {
		touchStartY = e.touches[0].clientY;
		initialHeight = node.getBoundingClientRect().height;
		node.style.transition = 'none';
	};

	const handleTouchMove = (e: TouchEvent) => {
		const currentY = e.touches[0].clientY;
		const movedY = Math.max(0, currentY - touchStartY); // Prevent swiping down
		updateModalTransform(movedY);
	};

	const handleTouchEnd = (e: TouchEvent) => {
		const currentY = e.changedTouches[0].clientY;
		const movedY = currentY - touchStartY;

		node.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';

		if (movedY > initialHeight * 0.4) {
			// Close if swiped more than 40% of height
			node.dispatchEvent(new CustomEvent('close', { bubbles: true }));
		} else {
			updateModalTransform(0); // Reset position
		}
	};

	node.addEventListener('touchstart', handleTouchStart, { passive: true });
	node.addEventListener('touchmove', handleTouchMove, { passive: true });
	node.addEventListener('touchend', handleTouchEnd, { passive: true });

	return {
		destroy() {
			cancelAnimationFrame(rafId);
			node.removeEventListener('touchstart', handleTouchStart);
			node.removeEventListener('touchmove', handleTouchMove);
			node.removeEventListener('touchend', handleTouchEnd);
		}
	};
}
