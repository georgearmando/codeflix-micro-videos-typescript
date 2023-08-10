FROM node:14.15.4-slim

# Vamos trabalhar no container com o usuario node e nao com o root para evitar 
# problemas de seguranca e vulnerabilidades
USER node

WORKDIR /home/node/app

# Vamos deixar o container em execucao.
CMD ["sh", "-c", "npm install && tail -f /dev/null"]