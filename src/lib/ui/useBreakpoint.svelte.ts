export function useBreakpoint() {
	const windowWidth = $derived(window ? window.innerWidth : 0);
	const breakpoint = $derived.by(() => {
		switch (true) {
			case windowWidth < 640:
				return 'xs';
			case windowWidth < 768:
				return 'sm';
			case windowWidth < 1024:
				return 'md';
			case windowWidth < 1280:
				return 'lg';
			case windowWidth < 1536:
				return 'xl';
			default:
				return '2xl';
		}
	});
	const isMobile = $derived(breakpoint === 'xs');
	return {
		get breakpoint() {
			return breakpoint;
		},
		get isMobile() {
			return isMobile;
		}
	};
}
