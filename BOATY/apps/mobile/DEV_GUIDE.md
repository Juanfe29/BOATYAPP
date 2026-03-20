# BOATY Mobile — Dev Guide

## Correr la app con tunnel (ngrok)

### Primera vez — instalar @expo/ngrok correcto
```bash
cd "/Users/juanfelipe/Documents/ISOMORPH AI/BOATY/apps/mobile" && npm install --save-dev @expo/ngrok@^4.0.1
```

### Configurar authtoken de ngrok (solo una vez)
```bash
npx ngrok authtoken 3B50G0tGql6M6Wd2lhCqXuNdLmD_7r9MJtv9grcAmD96N1KYZ
```

### Levantar el servidor con tunnel
```bash
cd "/Users/juanfelipe/Documents/ISOMORPH AI/BOATY/apps/mobile" && npx expo start --tunnel
```

Escanea el QR con **Expo Go** desde cualquier red.

---

## Requisitos
- Node 18+
- Expo Go en el móvil (SDK 51)
- Cuenta ngrok (gratuita) → https://ngrok.com

## Stack
- React Native + Expo Router
- TypeScript
- Paleta: `#0c2545` · `#1b3c6c` · `#f26a31` · `#eeeae6` · `#ffffff`
