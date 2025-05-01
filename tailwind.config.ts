/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: '#08D9D6',
  				foreground: '#252A34'
  			},
  			secondary: {
  				DEFAULT: '#FF2E63',
  				foreground: '#EAEAEA'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: '#EAEAEA',
  				foreground: '#252A34'
  			},
  			accent: {
  				DEFAULT: '#FF2E63',
  				foreground: '#EAEAEA'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			cyan: {
  				DEFAULT: '#08D9D6',
  				foreground: '#252A34'
  			},
  			dark: {
  				DEFAULT: '#252A34',
  				foreground: '#EAEAEA'
  			},
  			pink: {
  				DEFAULT: '#FF2E63',
  				foreground: '#EAEAEA'
  			},
  			light: {
  				DEFAULT: '#EAEAEA',
  				foreground: '#252A34'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: 0
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: 0
  				}
  			},
  			'pulse-border': {
  				'0%, 100%': {
  					borderColor: 'rgba(255, 46, 99, 0.3)'
  				},
  				'50%': {
  					borderColor: 'rgba(255, 46, 99, 0.8)'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'pulse-border': 'pulse-border 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  		},
  		transitionProperty: {
  			width: 'width'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
