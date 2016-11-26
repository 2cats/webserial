package main

import (
	"fmt"
	"github.com/googollee/go-socket.io"
	"github.com/tarm/serial"
	"log"
	"os"
)

var Serial *serial.Port

func SendBytes(so socketio.Socket, data []byte) error {
	length := len(data)
	if length < 1 {
		return nil
	}
	str := ""
	for i := 0; i < length; i++ {
		str = str + fmt.Sprintf("%02X ", data[i])
	}

	return so.Emit("rx", str)
}
func SerialOpen() {
	var err error
	c := &serial.Config{Name: Config.SerialPort, Baud: Config.SerialBuad}
	Serial, err = serial.OpenPort(c)
	if err != nil {
		fmt.Printf("无法打开 %s\n", Config.SerialPort)
		os.Exit(-1)
	}
}
func SerialReadThread() {
	buf := make([]byte, 512)
	var n int
	var err error
	for {
		n, err = Serial.Read(buf)
		if err != nil {
			log.Fatal(err)
		}
		for _, so := range solist {
			SendBytes(so, buf[:n])
		}
	}
}
