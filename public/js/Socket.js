import io from 'socket.io-client'
import Notification from './Notification'
import React from 'react'
class Socket extends React.Component{
    constructor(props){
        super(props);
        this.data=""
        this.datalen=0
        this.onDataFuncs=[]
        this.onControlFuncs=[]
        this.connected=false;
        this.socket=io.connect(window.location.toString());
        this.socket.on('rx', function(data) {
          this._onData(data);
        }.bind(this));
        this.socket.on('err', function(data) {
          Notification.error(data);
          this._onControl({type:'error',value:data})
        }.bind(this));
        this.socket.on('connect', function(data) {
            Notification.success("Connected");
            this.connected=true;
            this._onControl({type:'connected',value:this.connected})
        }.bind(this));
        this.socket.on('error', function(data) {
          Notification.error("Something Wrong!");
          this._onControl({type:'error',value:data})
        }.bind(this));
        this.socket.on('disconnect', function(data) {
          Notification.warning("Disconnected");
          this.connected=false;
          this._onControl({type:'connected',value:this.connected})
        }.bind(this));
    }
    _onControl(data){
        this.onControlFuncs.map((func)=>{
            if (func!=null){
                func(data);
            }
        })
    }
    clearData(){
        this.data="";
        this.datalen=0;
        this._onData(this.data);
    }
    _onData(data){
        if (data) {
            data=data.replace(/[\n\r]/g,'')
            this.datalen=this.datalen+data.trim().split(" ").length;
            this.data=this.data+data;
        }

        this.onDataFuncs.map((func)=>{
            if (func!=null){
                func(data);
            }
        })
    }
    onData(func){
        this.onDataFuncs.push(func);
    }
    onControl(func){
        this.onControlFuncs.push(func);
    }
    bin2ascii(array){
        var result = "";
        for(var i = 0; i < array.length; ++i){
            result+= (String.fromCharCode(array[i]));
        }
        return result;
    }
    hexString2ASCII(hexstr){
        return this.bin2ascii(parseRx(hexstr));
    }
    integerArray2HexString(data){
        let str=""
        for (let i in data){
            str=str+int2hex(data[i])+" ";
        }
        return str
    }
    rawString2HexString(str){
        if(str.length<1){
            return false
        }

        let sd="";
        for(let i=0;i<str.length;i++){
            let charcode=str.charCodeAt(i);
            let hexstr;
            if (charcode>=0&&charcode<=127){
                if(charcode===92){
                    hexstr=str.substring(i+2,i+4)
                    if(hexstr.length!=2){
                        return false;
                    }
                    i=i+3;
                }else{
                    hexstr=int2hex(charcode);
                }
            }else{
                hexstr=int2hex(charcode>>8)+" "+int2hex(charcode&0xff);
            }
            sd=sd+hexstr+" ";
        }
        return sd.toUpperCase();
    }
    send(str){
        this.socket.emit('tx',str);
        return 0;
    }

}

function parseRx(str){
    return str.trim().split(" ").map((ch)=>{return parseInt(ch,16)})
}
function int2hex(i){
    let hexstr=Number(i).toString(16);
    hexstr=hexstr.toUpperCase();
    if(hexstr.length < 2) {
        hexstr = '0' + hexstr;
    }
    return hexstr;
}

export default (new Socket);
