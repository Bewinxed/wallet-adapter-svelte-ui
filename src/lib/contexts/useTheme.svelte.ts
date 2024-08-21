import { getContext, hasContext, setContext } from 'svelte';

type ThemeColor<T extends keyof typeof colors = any> = {
	color: T;
	shade: (typeof colors)[T];
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ThemeConfig<T extends keyof typeof colors = any> = {
	colors: {
		base?: ThemeColor<T> | string;
		primary?: ThemeColor<T> | string;
		secondary?: ThemeColor<T> | string;
		accent?: ThemeColor<T> | string;
		backdrop?: ThemeColor<T> | string;
	};
};

export type Theme = {
	colors: {
		base?: string;
		primary?: string;
		accent?: string;
		secondary?: string;
		backdrop?: string;
	};
};

const colors = {
	base: {
		black: '#100F0F',
		950: '#1C1B1A',
		900: '#282726',
		850: '#343331',
		800: '#403E3C',
		700: '#575653',
		600: '#6F6E69',
		500: '#878580',
		300: '#B7B5AC',
		200: '#CECDC3',
		150: '#DAD8CE',
		100: '#E6E4D9',
		50: '#F2F0E5',
		paper: '#FFFCF0'
	},
	red: {
		DEFAULT: '#AF3029',
		light: '#D14D41'
	},
	orange: {
		DEFAULT: '#BC5215',
		light: '#DA702C'
	},
	yellow: {
		DEFAULT: '#AD8301',
		light: '#D0A215'
	},
	green: {
		DEFAULT: '#66800B',
		light: '#879A39'
	},
	cyan: {
		DEFAULT: '#24837B',
		light: '#3AA99F'
	},
	blue: {
		DEFAULT: '#205EA6',
		light: '#4385BE'
	},
	purple: {
		DEFAULT: '#5E409D',
		light: '#8B7EC8'
	},
	magenta: {
		DEFAULT: '#A02F6F',
		light: '#CE5D97'
	}
} as const;

function entries<T>(obj: T): Array<[keyof T, T[keyof T]]> {
	return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
}

const THEME_CONTEXT = Symbol('theme');
export function setThemeContext(config: ThemeConfig) {
	// build theme object
	const theme: Theme = { colors: {} };
	for (const [themeKey, themeValue] of entries(config)) {
		if (themeKey === 'colors') {
			for (const [key, value] of entries(themeValue)) {
				if (value) {
					if (typeof value === 'string') {
						theme.colors[key] = value;
					} else {
						theme.colors[key] = `${value.color}.${value.shade}`;
					}
				}
			}
		}
	}
	return setContext<typeof theme>(THEME_CONTEXT, theme);
}

export function useTheme() {
	if (!hasContext(THEME_CONTEXT)) {
		throw new Error('Theme context has not been set');
	}

	const theme = $derived(getContext<Theme>(THEME_CONTEXT));
	return theme;
}
