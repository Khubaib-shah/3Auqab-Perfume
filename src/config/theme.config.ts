export interface ThemeColors {
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceMuted: string;
  textHeading: string;
  textBody: string;
  textMuted: string;
  borderLight: string;
  borderMedium: string;
  buttonText: string;
  success: string;
  danger: string;
  warning: string;
}

export interface ThemeFonts {
  heading: string;
  body: string;
  googleFontUrl: string;
}

export interface ThemeRadius {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  full: string;
}

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
}

export interface ThemeConfig {
  colors: ThemeColors;
  gradients: { overlay: string };
  fonts: ThemeFonts;
  radius: ThemeRadius;
  shadows: ThemeShadows;
  container: { md: string; lg: string; xl: string; xxl: string };
}

/**
 * Single source of truth for all visual branding.
 * Values are injected as CSS variables on <html> (see `getThemeCssVariables`),
 * so every stylesheet and component that uses `var(--color-*)` follows this file.
 */
export const themeConfig: ThemeConfig = {
  colors: {
    primary: "#ab8e66",
    primaryHover: "#93774f",
    secondary: "#222222",
    accent: "#d8c3a5",
    background: "#ffffff",
    surface: "#fbfaf8",
    surfaceMuted: "#f5f5f5",
    textHeading: "#222222",
    textBody: "#555555",
    textMuted: "#777777",
    borderLight: "#eeeeee",
    borderMedium: "#e5e5e5",
    buttonText: "#ffffff",
    success: "#28a745",
    danger: "#dc3545",
    warning: "#ffc107",
  },

  gradients: {
    overlay:
      "linear-gradient(to top, rgba(20, 20, 20, 0.88) 0%, rgba(20, 20, 20, 0.5) 60%, transparent 100%)",
  },

  fonts: {
    heading: "'Jost', sans-serif",
    body: "'Jost', sans-serif",
    googleFontUrl:
      "https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap",
  },

  radius: {
    xs: "3px",
    sm: "6px",
    md: "8px",
    lg: "16px",
    full: "9999px",
  },

  shadows: {
    sm: "0 2px 8px rgba(0, 0, 0, 0.04)",
    md: "0 4px 16px rgba(0, 0, 0, 0.06)",
    lg: "0 8px 24px rgba(0, 0, 0, 0.08)",
  },

  container: {
    md: "920px",
    lg: "1160px",
    xl: "1260px",
    xxl: "1320px",
  },
};

/** Converts the theme config into CSS custom properties for the root element. */
export function getThemeCssVariables(theme: ThemeConfig = themeConfig): Record<string, string> {
  const { colors, fonts, radius, shadows, gradients, container } = theme;
  return {
    "--color-primary": colors.primary,
    "--color-primary-hover": colors.primaryHover,
    "--color-secondary": colors.secondary,
    "--color-accent": colors.accent,
    "--color-background": colors.background,
    "--color-surface": colors.surface,
    "--color-surface-muted": colors.surfaceMuted,
    "--color-heading": colors.textHeading,
    "--color-body": colors.textBody,
    "--color-muted": colors.textMuted,
    "--color-border-light": colors.borderLight,
    "--color-border-medium": colors.borderMedium,
    "--color-button-text": colors.buttonText,
    "--color-success": colors.success,
    "--color-danger": colors.danger,
    "--color-warning": colors.warning,
    "--gradient-overlay": gradients.overlay,
    "--font-heading": fonts.heading,
    "--font-body": fonts.body,
    "--radius-xs": radius.xs,
    "--radius-sm": radius.sm,
    "--radius-md": radius.md,
    "--radius-lg": radius.lg,
    "--radius-full": radius.full,
    "--shadow-sm": shadows.sm,
    "--shadow-md": shadows.md,
    "--shadow-lg": shadows.lg,
    "--container-md": container.md,
    "--container-lg": container.lg,
    "--container-xl": container.xl,
    "--container-xxl": container.xxl,
  };
}
