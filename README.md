## Envious Online
Content pending

## Getting started
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
Deploy locally with
``` bash
  $ DEBUG=EnviousOnline ./bin/www
```
Access locally at 
```
  127.0.0.1:3000
```
Server hosts at [104.131.30.31](http://104.131.30.31/)


## Coming soon
* Using npm [forever](https://github.com/nodejitsu/forever) script on the server to manage the web app
* Starting with the actual project

More to come. Promise!
