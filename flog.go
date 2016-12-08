package main

import (
	"io/ioutil"
	"log"
	"os"
	"time"
)

var Flogger *log.Logger

func FlogInit() {
	logFile, err := os.Create(time.Now().Format("2006_01_02_15_04_05") + ".log")
	panicWhenError(err)
	Flogger = log.New(logFile, "", 0)
	// debugLog.Printf("ABC\r\n")
	// // debugLog.SetPrefix("[Info]")
	// debugLog.Printf("DD\r\n")
}
func ReadLog(filename string) []byte {
	logfile, err := os.OpenFile(filename, os.O_RDONLY, 0666)
	if err != nil {
		log.Printf(err.Error())
		return nil
	}
	faw, err := ioutil.ReadAll(logfile)
	if err != nil {
		log.Printf(err.Error())
		return nil
	}
	return faw
}
