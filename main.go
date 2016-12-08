package main

import (
	"encoding/hex"

	"encoding/json"

	"log"
	"net/http"
	"strings"
	"time"

	"github.com/googollee/go-socket.io"
	"github.com/skratchdot/open-golang/open"
)

type ControlMsg struct {
	Type  string
	Value string
}

func String2Bytes(s string) ([]byte, error) {
	s = strings.Trim(s, " ")
	s = strings.Replace(s, " ", "", -1)
	bs, err := hex.DecodeString(s)
	return bs, err
}
func SendErr(so socketio.Socket, err error) {
	so.Emit("err", err.Error())
}

var solist map[string]socketio.Socket

func delayStartBrowser(t time.Duration) {
	strs := strings.Split(Config.HTTPAddr, ":")
	if len(strs) == 2 {
		time.Sleep(t)
		open.Run("http://localhost:" + strs[1])
	}

}


func main() {
	ReadConfiguration()
	FlogInit()
	solist = make(map[string]socketio.Socket)
	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal(err)
	}
	server.On("connection", func(so socketio.Socket) {
		solist[so.Id()] = so
		log.Println("on connection")
		files, err := ListDir(".", ".log")
		if err == nil && files != nil && len(files) > 0 {
			histjson, err := json.Marshal(files)
			if err == nil {
				so.Emit("historylist", string(histjson))
			}
		}

		so.On("history", func(msg string) {
			bs ,err:= ReadLog(msg)
			if bs != nil && len(bs)>0{
				so.Emit("rx", string(bs))
			}else{
				checkReportError(err)
			}
		})
		so.On("tx", func(msg string) {
			bs, _ := String2Bytes(msg)
			_, err := Serial.Write(bs)
			checkReportError(err)
		})
		so.On("err", func(msg string) {
			log.Printf("!ERR: " + msg)
		})
		so.On("disconnection", func() {
			log.Println("on disconnect")
			for k, _ := range solist {
				if k == so.Id() {
					delete(solist, k)
					break
				}
			}
		})
	})
	server.On("error", func(so socketio.Socket, err error) {
		log.Println("error:", err)
	})
	http.Handle("/socket.io/", server)
	http.Handle("/", http.FileServer(http.Dir("./public")))
	err = SerialOpen()
	if err != nil {
		log.Fatalf("Cannot Open %s", Config.SerialPort)
	}
	go SerialReadThread()
	go delayStartBrowser(time.Second)
	log.Println("Serving at " + Config.HTTPAddr)
	log.Fatal(http.ListenAndServe(Config.HTTPAddr, nil))

}
