package main

import (
	"io/ioutil"
	"os"
	"strings"
)

func TruncateLog() {
	logfile, err := os.OpenFile(logfilename, os.O_RDWR|os.O_TRUNC, 0666)
	defer logfile.Close()
	checkReportError(err)

}
func ListDir(dirPth string, suffix string) (files []string, err error) {
	files = make([]string, 0, 10)

	dir, err := ioutil.ReadDir(dirPth)
	if err != nil {
		return nil, err
	}

	// PthSep := string(os.PathSeparator)
	suffix = strings.ToUpper(suffix) //忽略后缀匹配的大小写

	for i := len(dir) - 1; i >= 0; i-- {
		fi := dir[i]
		if fi.IsDir() { // 忽略目录
			continue
		}
		if strings.HasSuffix(strings.ToUpper(fi.Name()), suffix) { //匹配文件
			files = append(files, fi.Name())
		}
	}
	return files, nil
}
