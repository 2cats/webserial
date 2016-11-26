import React, { Component } from 'react'
import { Menu,Segment ,Input ,Button,Checkbox,Icon,Card} from 'semantic-ui-react'
import NotificationSystem from 'react-notification-system'
import Notification from './Notification'
import Socket from './Socket'
import Sender from './Sender'
import Filter from './Filter'
import Screen from './Screen'
import Animation from './Animation'
import {css} from 'aphrodite';
import ReactHeight from 'react-height';
import '../node_modules/react-grid-layout/css/styles.css'
import '../node_modules/react-resizable/css/styles.css'
import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default class Root extends Component {
	constructor(props){
		super(props);
		this.state = {
			activeItem: 'Interact' ,
			connected:false,
			compsCount:0,
			layouts:[]
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
				id:this.id,
				className:css(Animation.in),
		    	onDeleteClick:this.handleDeleteComp.bind(this)
				}
		);

		this.comps.push(
			<div  id={this.id} key={String(this.id)}>
				{comp}
			</div>
			);
		this.setState({
			layouts:[...this.state.layouts,{
							x: 0,
							y: 0,
							w: 1,
							h: comp.props.h,
							i: String(this.id)
					}],
			compsCount: this.state.compsCount+1
		})
		this.id++;
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
componentDidUpdate(){

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
		          <Menu.Item name='Sender' onClick={()=>{this.addNewComp.bind(this)(<Sender h={7} />)}} />
		          <Menu.Item name='Filter'  onClick={()=>{this.addNewComp.bind(this)(<Filter h={15} />)}} />
		          <Menu.Item name='Screen'  onClick={()=>{this.addNewComp.bind(this)(<Screen h={30} />)}} />
		          <Menu.Item name='Clear'  onClick={this.handleClearClick.bind(this)} />
		          <Menu.Menu position='right'>
		          	<Menu.Item>
		            	{connectedIcon}
		 	        </Menu.Item>
		        	</Menu.Menu>
		        </Menu>
		        <div style={{position:"relative"}}>
		         <ResponsiveReactGridLayout className="layout" 
		         	  layouts={{xxs:this.state.layouts}}
			          rowHeight={1}
				      breakpoints={{lg: 0, md: 0, sm: 0, xs: 0, xxs: 0}}
				      cols={{lg: 2, md: 2, sm: 2, xs: 2, xxs: 2}}>
				      {this.comps}
			    </ResponsiveReactGridLayout>
				</div>
		        <NotificationSystem ref="notificationSystem" />
	    	</div>
	    )
  	}
}
