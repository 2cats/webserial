win:
	go build
	cd public && webpack
	tar -zcf serial_socket_bin.tar.gz *.exe config.txt public/index.html public/css public/js/bundle.js