import React, { Component } from 'react'
import { Menu,Segment ,Input ,Button,Grid,Card,Checkbox,Form ,Dropdown,Icon} from 'semantic-ui-react'
import Socket from './Socket'
import DeleteButton from './DeleteButton'

function getSelectionText(){
    var selectedText = ""
    if (window.getSelection){ // all modern browsers and IE9+
        selectedText = window.getSelection().toString()
    }
    return selectedText
}
export default class Screen extends Component {
	constructor(props){
		super(props);
		this.state = { 
			_newdata:[],
			hex:false,
			trans:"",
		}
		Socket.onData(this.handleSocketData.bind(this));
	}
	handleSocketData(dat){
		this.setState({
			_newdata:dat
		})
	}
	onMouseUp(data){
		if(!this.state.hex){
			return;
		}
		let selection=window.getSelection();
	  	let str=selection.toString()
	  	if (str) {
	  		  this.setState({
	  		  	trans:Socket.hexString2ASCII(str)
	  		  })
	  	}else{
	  		 this.setState({
	  		  	trans:""
	  		  })
	  	}
	  }
	 handleHexChange(event, { name, value, checked }){
		this.setState({
			hex:checked
			}
		)
	}
	render(){
		let dataShow;
		if(this.state.hex){
			dataShow=Socket.data;
		}else{
			dataShow=Socket.hexString2ASCII(Socket.data);
		}
		return (

			<div  onMouseUp={this.onMouseUp.bind(this)} style={{position:"relative",marginTop:"10px"}}>
				<Segment overflow='scroll' style={{overflowY:'auto',height:"300px",wordWrap:'break-word',wordBreak:'break-all'}}>
			      <pre style={{whiteSpace: 'pre-wrap',wordWrap: 'break-word'}}>
			      	{dataShow}
			      </pre>
			    </Segment>
			    
			    <Segment  color='violet' hidden={!this.state.trans}  overflow='scroll' style={{overflowY:'auto'}}>
			      <pre style={{whiteSpace: 'pre-wrap',wordWrap: 'break-word'}}>
			      	{this.state.trans}
			      </pre>
			    </Segment>

			    <div style={{position:"absolute" ,top:"5px",right:"5px"}}>
			    	<Checkbox toggle checked={this.state.hex} onChange={this.handleHexChange.bind(this)} style={{marginLeft:"5px" ,marginRight:"5px",alignSelf:'center'}} label='Hex'  />
			    	<DeleteButton {...this.props} />
			    </div>
			</div>
  

		)
	}
}