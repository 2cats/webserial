class Notification{
	constructor() {
    	this._system=null;
  	}
  	notify(msg,level) {
		this._system.addNotification({
	      message: msg,
	      level: level,
				position:'br'
	    });
  	}
  	 success(msg) {
		this.notify(msg,"success")
  	}
     error(msg) {
		this.notify(msg,"error")
  	}
  	 warning (msg) {
		this.notify(msg,"warning")
  	}
     info(msg) {
		this.notify(msg,"info")
  	}
}

export default (new Notification);
