package main

import (
	"fmt"

	"gopkg.in/gcfg.v1"
)

const (
	ConfigFileName = "config.txt"
)

func panicWhenError(err error) {
	if err != nil {
		panic(err)
	}
}

var _Config struct {
	Common struct {
		HTTPAddr   string
		SerialPort string
		SerialBuad int
		SendInterval int
	}
}
var Config = &_Config.Common

func ReadConfiguration() {
	err := gcfg.ReadFileInto(&_Config, ConfigFileName)
	panicWhenError(err)
	if Config.SendInterval<0{
		Config.SendInterval=0;
	}
	fmt.Printf("Config:%+v\n", *Config)
}
