FROM ubuntu:xenial
MAINTAINER Mike Leach <mike@kiva.org>

# builds a docker image suitable for Jenkins that includes:
#  - jdk8 for jenkins agent
#  - curl for nodejs repo setup
#  - nodejs 6.x latest
#  - npm 5.3.0
#  - git and ssh

# TODO:
#  - currently gets latest nodejs 6.x, should adjust to be more specific
#  - openssh section might be overkill

# Install JDK 8 (latest edition)
RUN apt-get -q update &&\
    DEBIAN_FRONTEND="noninteractive" apt-get -q install -y -o Dpkg::Options::="--force-confnew" --no-install-recommends software-properties-common &&\
    add-apt-repository -y ppa:openjdk-r/ppa &&\
    apt-get -q update &&\
    DEBIAN_FRONTEND="noninteractive" apt-get -q install -y -o Dpkg::Options::="--force-confnew" --no-install-recommends openjdk-8-jre-headless

# install nodejs (to get npm) - due to node bug, npm upgrade has to be in same command line here
RUN DEBIAN_FRONTEND="noninteractive" apt-get -q install -y -o Dpkg::Options::="--force-confnew" --no-install-recommends curl &&\
    curl -sL https://deb.nodesource.com/setup_6.x | bash - &&\
    DEBIAN_FRONTEND="noninteractive" apt-get -q upgrade -y -o Dpkg::Options::="--force-confnew" --no-install-recommends &&\
    DEBIAN_FRONTEND="noninteractive" apt-get -q install -y -o Dpkg::Options::="--force-confnew" --no-install-recommends nodejs &&\
    npm install -g npm@5.3.0

# git needs ssh?  or jenkins does?  not sure.
RUN DEBIAN_FRONTEND="noninteractive" apt-get -q install -y -o Dpkg::Options::="--force-confnew" --no-install-recommends openssh-server &&\
    sed -i 's|session    required     pam_loginuid.so|session    optional     pam_loginuid.so|g' /etc/pam.d/sshd &&\
    mkdir -p /var/run/sshd

# we need git and npm needs bzip2
RUN DEBIAN_FRONTEND="noninteractive" apt-get -q install -y -o Dpkg::Options::="--force-confnew" --no-install-recommends git bzip2

# clean up apt cruft
RUN apt-get -q autoremove &&\
    apt-get -q clean -y && rm -rf /var/lib/apt/lists/* && rm -f /var/cache/apt/*.bin
