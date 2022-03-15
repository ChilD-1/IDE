FROM ubuntu:20.04
USER root

RUN apt-get update
RUN apt-get -y install curl gnupg

# Install Node
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get -y install nodejs

# Set the timezone so Golang doesn't pause during install
# Taken from: https://askubuntu.com/a/1098881
ENV TZ=Europe/Minsk
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Install Go and Python
RUN apt-get -y install golang
RUN apt-get -y install python3


