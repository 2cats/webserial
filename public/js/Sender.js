import React, { Component } from 'react'
import { Menu,Segment ,Input ,Button,Grid,Checkbox,Form ,Dropdown,Icon} from 'semantic-ui-react'
import Socket from './Socket'
import DeleteButton from './DeleteButton'

export default class Sender extends Component {
	constructor(props){
		super(props);
		this.state = {
			input:"",
			errInput:false,
			sendDisabled:true,
		}
	}
	handleInputChange(e,obj){
	this.setState({
		input:obj.value
	})
	let sd=Socket.rawString2HexString(obj.value);
	if(!sd){
		if(obj.value){
			this.setState({
				errInput:true,
				sendDisabled:true,
			})
		}else{
			this.setState({
				errInput:false,
				sendDisabled:true,
			})
		}

	}else{
		this.setState({
			errInput:false,
			sendDisabled:false,
		})
	}
}
handleSendInput(){
	let str =this.state.input;
	let sd=Socket.rawString2HexString(str);
	Socket.send(sd);
}
	render(){
		return (
 			<Segment style={{height:"100%"}} className={this.props.className} raised color='blue' >
	      		<div  style={{display:'flex'}}>
		        	<Input
		        	style={{flexGrow:'1',marginRight:"5px"}}
						fluid
					  	ref="input"
					  	value={this.state.input}
					    action={{ color: 'teal', labelPosition: 'left',disabled:this.state.sendDisabled, icon: 'terminal', content: 'Send' ,onClick:this.handleSendInput.bind(this) }}
					    actionPosition='left'
					    placeholder='Input'
					    error={this.state.errInput}
					    onChange={this.handleInputChange.bind(this)}
						></Input>
					<DeleteButton {...this.props}/>
	        	</div>
			</Segment>
		)
	}
}
