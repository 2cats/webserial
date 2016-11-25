import React, { Component } from 'react'
import { Menu,Segment ,Input ,Button,Grid,Card,Checkbox,Form ,Dropdown,Icon} from 'semantic-ui-react'
import Socket from './Socket'

export default class DeleteButton extends Component {
	constructor(props){
		super(props);
		this.state = { 
		}
	}
	render(){
		return(
	
				 <Button
			      	onClick={()=>{this.props.onDeleteClick(this.props.id)}}
			      	basic circular icon >
				    <Icon  name='remove ' />
				</Button>


			)
			
	}
}