# --- Сборка React-приложения ---
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Сборка проекта
RUN npm run build

# --- Продакшен сервер: Nginx ---
FROM nginx:stable-alpine

# Копируем собранный проект в папку Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Заменим дефолтный конфиг nginx, если нужен кастом (иначе можно опустить)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Кэширование отключено, чтобы .env переменная корректно читалась при билде
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
