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
	}
}
var Config = &_Config.Common

func ReadConfiguration() {
	err := gcfg.ReadFileInto(&_Config, ConfigFileName)
	panicWhenError(err)
	fmt.Printf("Config:%+v\n", *Config)
}
