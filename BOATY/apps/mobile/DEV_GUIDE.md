# BOATY Mobile — Dev Guide

## Setup inicial (solo la primera vez)

**1. Clonar el repo**
```bash
git clone https://github.com/Juanfe29/BOATYAPP.git
cd BOATYAPP/apps/mobile
```

**2. Instalar dependencias**
```bash
npm install
```

**3. Instalar el puente de ngrok correcto**
```bash
npm install --save-dev @expo/ngrok@^4.0.1
```

**4. Configurar authtoken de ngrok** (solo una vez por máquina)
```bash
npx ngrok authtoken 3B50G0tGql6M6Wd2lhCqXuNdLmD_7r9MJtv9grcAmD96N1KYZ
```

---

## Levantar la app con tunnel (ngrok)

```bash
cd "/Users/juanfelipe/Documents/ISOMORPH AI/BOATY/apps/mobile" && npx expo start --tunnel
```

Escanea el QR con **Expo Go** desde cualquier red (no importa si estás en otra WiFi o en datos móviles).

---

## Requisitos
- Node 18+
- Expo Go instalado en el móvil (compatible con SDK 51)
- Cuenta ngrok gratuita → https://ngrok.com

## Stack
- React Native + Expo Router
- TypeScript
- Paleta oficial: `#0c2545` · `#1b3c6c` · `#f26a31` · `#eeeae6` · `#ffffff`
