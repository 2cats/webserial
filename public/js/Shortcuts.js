let Shortcuts={
  send:[
    {icon:'volume control phone',text:'Phone Call',cmd:'atd;'},
    {icon:'comment outline ',text:'Send SMS',cmd:'at+cmgs="10001"\\x0d102\\x00\\x1a;'},
    {icon:'mail outline ',text:'Read SMS',cmd:'at+cmgr=14\\x0d;'},
  ]
}
export default Shortcuts;
