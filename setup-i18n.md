# i18n Setup Guide

To complete the multilingual setup, you need to install the required dependencies:

## Install Dependencies

Run the following command in your project root:

```bash
npm install i18next react-i18next
```

## What's Already Set Up

1. ✅ Translation files created:

   - `public/locales/en/common.json`
   - `public/locales/hi/common.json`
   - `public/locales/gu/common.json`

2. ✅ Language provider component created:

   - `components/providers/language-provider.tsx`

3. ✅ Language switcher component created:

   - `components/ui/language-switcher.tsx`

4. ✅ Updated components:
   - Homepage uses translations
   - Navigation includes language switcher
   - Layout includes language provider

## Features Implemented

- 🌐 Support for English, Hindi, and Gujarati
- 💾 Language preference saved in localStorage
- 🔄 Instant language switching without page reload
- 🎨 Beautiful language switcher with flag icons
- 📱 Responsive design

## How It Works

1. The `LanguageProvider` initializes i18next with translations
2. User's language preference is read from localStorage
3. The `LanguageSwitcher` component shows flag icons and allows switching languages
4. When language is changed, it's saved to localStorage and instantly updates without page reload
5. All text content uses `useTranslation('common')` hook

## Usage

In any component, use the translation hook:

```tsx
import { useTranslation } from "react-i18next";

const MyComponent = () => {
  const { t } = useTranslation("common");

  return <h1>{t("homepage.hero.title")}</h1>;
};
```

After installing the dependencies, your app will be fully multilingual!
