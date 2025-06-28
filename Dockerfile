# ---------- Build Stage ----------
FROM node:20-alpine AS build

WORKDIR /app

# Copy only deps files first (to leverage cache)
COPY package.json package-lock.json ./
RUN npm ci

# Now copy all source files
COPY . .

# Build Vite app
RUN npm run build

# ---------- Production Stage ----------
FROM node:20-alpine AS prod

WORKDIR /app

# Copy built dist and runtime files
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# Copy config files if needed for Vite preview to detect .ts configs
COPY --from=build /app/vite.config.ts ./vite.config.ts
COPY --from=build /app/tsconfig.json ./tsconfig.json

# Explicitly copy important public files to ensure they are included
COPY --from=build /app/public/sitemap.xml ./dist/sitemap.xml
COPY --from=build /app/public/robots.txt ./dist/robots.txt
COPY --from=build /app/public/assets ./dist/assets

EXPOSE 3004

# ⏯ Jalankan preview server dengan config TS
CMD ["npx", "vite", "preview", "--config", "vite.config.ts", "--port", "3004", "--host"]