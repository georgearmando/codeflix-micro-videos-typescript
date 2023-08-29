FROM node:18.17.1-slim

RUN mkdir -p /usr/share/man/man1 && \
    apt update && \
    echo 'deb http://ftp.debian.org/debian stretch-backports main' | tee /etc/apt/sources.list.d/stretch-backports.list && \
    apt install -y \
    git \
    ca-certificates \
    openjdk-17-jre \
    zsh \
    curl \
    wget

ENV JAVA_HOME="/usr/lib/jvm/java-11-openjdk-amd64"

# Vamos trabalhar no container com o usuario node e nao com o root para evitar 
# problemas de seguranca e vulnerabilidades
USER node

RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" -- \
    -t https://github.com/romkatv/powerlevel10k \
    -p git \
    -p git-flow \
    -p https://github.com/zdharma-continuum/fast-syntax-highlighting \
    -p https://github.com/zsh-users/zsh-autosuggestions \
    -p https://github.com/zsh-users/zsh-completions \
    -a 'export TERM=xterm-256color'

RUN echo '[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh' >> ~/.zshrc && \
    echo 'HISTFILE=/home/node/zsh/.zsh_history' >> ~/.zshrc 

WORKDIR /home/node/app

# Vamos deixar o container em execucao.
CMD ["sh", "-c", "npm install && tail -f /dev/null"]

#####
# default-jre -> intsalamos para que a extensao sonarlint funcione corretamente
#                uma vez que ela usa o java
# ca0certificates -> instalamos para permitir executar o git pull