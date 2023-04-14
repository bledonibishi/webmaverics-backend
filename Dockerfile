FROM node:14.20.0

WORKDIR /app

COPY package*.json ./

# SHELL FROMdocker run -p 5000:5000 myapp
RUN npm install 

COPY . .

ENV PORT=5000

EXPOSE 5000
# EXEC FORM
CMD ["npm","run", "start"]