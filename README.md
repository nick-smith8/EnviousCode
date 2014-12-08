## Envious Online

## i. Repo Organization

Contained is our node files which runs the game client and server side. It is split into 3 branches: master, GameEngine and SocketBranch which were used to work on different parts of the game simultaniously. 


## ii., iii.  Fall 2014 Final Submission
``` bash
  $ [sudo] apt-get update
  $ [sudo] apt-get install nodejs npm
```
**Installing dependencies**: Installs all dependencies in package.json
``` bash
  $ git clone https://github.com/nick-smith8/EnviousOnline
  $ cd EnviousOnline
  $ [sudo] npm install
```

**Installing MongoDB**: Installs sample database for local use
``` bash
  $ apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
  $ echo "deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen" | tee -a /etc/apt/sources.list.d/10gen.list
  $ [sudo] apt-get -y update
  $ [sudo] apt-get -y install mongodb-10gen
```
Access database with
``` bash
  $ mongo
```
## Usage

Server hosts at [104.131.30.31](http://104.131.30.31/)


## vi. Not using CI System.

