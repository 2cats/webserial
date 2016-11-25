import React, { Component } from 'react'
import { Menu,Segment ,Input ,Button,Grid,Card,Checkbox,Form ,Dropdown,Icon} from 'semantic-ui-react'
import Socket from './Socket'
import DeleteButton from './DeleteButton'
import Style from './Style'

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

			<div className={this.props.className} onMouseUp={this.onMouseUp.bind(this)} style={{height:"300px",position:"relative"}}>
				<Segment raised color='green' overflow='scroll' style={{overflowY:'auto',height:"100%",wordWrap:'break-word',wordBreak:'break-all'}}>
            <div style={{marginTop:"25px"}}>
              <pre style={Style.pre}>
                {dataShow}
              </pre>
            </div>

			    </Segment>

			    <Segment raised color='violet' hidden={!this.state.trans}  overflow='scroll' style={{overflowY:'auto'}}>
			      <pre style={Style.pre}>
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
