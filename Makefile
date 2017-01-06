VERSION		=   v0.1
bin_name 	= 	webserial
tar_content :=   ${bin_name}  config.txt public/index.html public/*.ico public/js/bundle.js

all:
	#make webpack
	export GOARCH=amd64 GOOS=linux
	#go build -o $(bin_name)
	tar -zcf ${bin_name}-${VERSION}-$GOOS-$GOARCH.tar.gz ${tar_content}

default :
	GOARCH=$(GOARCH) GOOS=$(GOOS) go build -o $(bin_name)
	make pack
webpack:
	cd public && webpack
tar:
#	cd public && webpack
	tar -zcf ${tar_name}.tar.gz  
