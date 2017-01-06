package main

import (
	"fmt"
	"log"
	"time"

	"github.com/tarm/serial"
)

var Serial *serial.Port
const (
	SERIAL_CONNECTED_TOPIC = "serial_connected"
)
var (
	serial_connected="n"
)
func RawBytes2StrBytes(data []byte) string {
	length := len(data)
	if length < 1 {
		return ""
	}
	str := ""
	for i := 0; i < length; i++ {
		str = str + fmt.Sprintf("%02X ", data[i])
	}
	return str
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
	for{
		err = SerialOpen()
		if err == nil {
			break
		}
		log.Printf("Cannot Open %s\n", Config.SerialPort)
		time.Sleep(time.Second*2)
	}
	serial_connected="y"
	emit2All(SERIAL_CONNECTED_TOPIC,serial_connected)
	for {
		if Config.SendInterval > 0 {
			time.Sleep(time.Duration(Config.SendInterval) * time.Millisecond)
		}
		n, err = Serial.Read(buf)
		if err != nil {
			serial_connected="n"
			emit2All(SERIAL_CONNECTED_TOPIC,serial_connected)
			for {
				log.Printf("[Retry] Opening SerialPort")
				if Serial != nil {
					Serial.Close()
				}
				err = SerialOpen()
				if err == nil {
					serial_connected="y"
					emit2All(SERIAL_CONNECTED_TOPIC,serial_connected)
					break
				}
				time.Sleep(time.Second * 2)
			}
		}

		if n > 0 {
			log.Printf("Serial Recv: %d", n)
			str:=RawBytes2StrBytes(buf[:n])
			Flogger.Printf(str)
			emit2All("rx",str)
		}

	}
}
