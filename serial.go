package main

import (
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/tarm/serial"
)

var Serial *serial.Port

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
	for {
		if Config.SendInterval > 0 {
			time.Sleep(time.Duration(Config.SendInterval) * time.Millisecond)
		}
		n, err = Serial.Read(buf)
		if err != nil {
			checkReportError(errors.New("Serial Port Unexpectedly Closed"))
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
			log.Printf("Serial Recv: %d", n)
			str:=RawBytes2StrBytes(buf[:n])
			Flogger.Printf(str)
			for _, so := range solist {
				so.Emit("rx", str)
			}
		}

	}
}
