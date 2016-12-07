package main

import (
	"fmt"
	"log"

	"github.com/googollee/go-socket.io"
	"github.com/tarm/serial"

	"time"
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
func SerialOpen() error {
	var err error
	c := &serial.Config{Name: Config.SerialPort, Baud: Config.SerialBuad}
	Serial, err = serial.OpenPort(c)
	return err
}
func SerialReadThread() {
	buf := make([]byte, 10240)
	var n int
	var err error
	for {
		if Config.SendInterval > 0 {
			time.Sleep(time.Duration(Config.SendInterval) * time.Millisecond)
		}

		n, err = Serial.Read(buf)
		if err != nil {
			for {
				log.Printf("[Retry] Opening SerialPort")
				if Serial != nil {
					Serial.Close()
				}
				err = SerialOpen()
				if err == nil {
					log.Printf("SerialPort Opened")
					break
				}
				time.Sleep(time.Second * 2)
			}
		}
		if n > 0 {
			for _, so := range solist {
				log.Printf("Serial Recv: %d", n)
				SendBytes(so, buf[:n])
			}
		}

	}
}
