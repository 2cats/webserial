import React, { Component } from 'react'
import { Menu,Segment ,Input ,Button,Checkbox,Icon,Card} from 'semantic-ui-react'

import NotificationSystem from 'react-notification-system'
import Notification from './Notification'
import Socket from './Socket'
import Sender from './Sender'
import Filter from './Filter'
import Screen from './Screen'


export default class Root extends Component {
	constructor(props){
		super(props);
		this.state = { 
			activeItem: 'Interact' ,
			connected:false,
			// comps:[],
			compsCount:0,
		}
		this.comps=[];
		this.id=0;
		Socket.onControl(this.handleSocketControl.bind(this));	
		this.handleItemClick = (e, { name }) => this.setState({ activeItem: name })
	}
	handleClearClick(){
		Socket.clearData()
	}

	addNewComp(_comp){
		let comp = React.cloneElement(
		    _comp, 
		    { 
		    	id: this.id,
		    	onDeleteClick:this.handleDeleteComp.bind(this) }
		);
		this.id++;
		this.comps.push(comp);
		this.setState({
			compsCount: this.state.compsCount+1
		})
	}
	handleDeleteComp(id){
		for (let k in this.comps){
			if(this.comps[k].props.id===id){
				this.comps.splice(k,1)
				this.setState({
					compsCount: this.state.compsCount-1
				})
				break;
			}
		}

	}

	handleSocketControl(data){
		if(data.type==="connected"){
			this.setState({
				connected:data.value
			})
		}else if (data.type==="error"){

		}
	}

	  componentDidMount() {
	    Notification._system = this.refs.notificationSystem;
	  }

	render() {
	    const { activeItem } = this.state
		let connectedIcon;
		if (this.state.connected){
			connectedIcon=<Icon name='linkify' />
		}else{
			connectedIcon=<Icon loading name='spinner' />
		}
    	return (
	    	<div style={{margin:"10px",flex:1}}>
		        <Menu stackable   >
		          <Menu.Item name='Sender' onClick={()=>{this.addNewComp.bind(this)(<Sender />)}} />
		          <Menu.Item name='Filter'  onClick={()=>{this.addNewComp.bind(this)(<Filter />)}} />
		          <Menu.Item name='Screen'  onClick={()=>{this.addNewComp.bind(this)(<Screen />)}} />
		          <Menu.Item name='Clear'  onClick={this.handleClearClick.bind(this)} />
		          <Menu.Menu position='right'>
		          	<Menu.Item>
		            	{connectedIcon}
		 	        </Menu.Item>
		        	</Menu.Menu>
		        </Menu>
		        <div style={{position:"relative"}}>
		        	{this.comps}
				</div>
		        <NotificationSystem ref="notificationSystem" />
	    	</div>
	    )
  	}
}