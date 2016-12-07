GOARCH		=	arm
GOOS		=	linux
bin_name 	= 	webserial
tar_name   	= 	webserial
all :
	GOARCH=$(GOARCH) GOOS=$(GOOS) go build -o $(bin_name)
	make pack
pack:
	cd public && webpack
	tar -zcf ${tar_name}.tar.gz  ${bin_name}  config.txt public/index.html public/css public/js/bundle.js
