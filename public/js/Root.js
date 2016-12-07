import '../node_modules/react-grid-layout/css/styles.css'
import '../node_modules/react-resizable/css/styles.css'
import '../css/semantic/semantic.min.css'
import '../css/animate.css'
import React, { Component } from 'react'
import { Menu,Segment ,Dropdown,Statistic,Input ,Button,Checkbox,Icon,Card} from 'semantic-ui-react'
import NotificationSystem from 'react-notification-system'
import Notification from './Notification'
import Socket from './Socket'
import Sender from './Sender'
import Filter from './Filter'
import Screen from './Screen'
import Animation from './Animation'
import {css} from 'aphrodite';
import ReactHeight from 'react-height';
import CountUp from 'react-countup';
import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default class Root extends Component {
	constructor(props){
		super(props);
		this.state = {
			activeItem: 'Interact' ,
			connected:false,
			compsCount:0,
			layouts:[],
			countStart:0,
			countEnd:0,
		}
		this.comps=[];
		this.id=0;
		Socket.onData(this.handleSocketData.bind(this));
		Socket.onControl(this.handleSocketControl.bind(this));
		this.handleItemClick = (e, { name }) => this.setState({ activeItem: name })
	}
	handleClearClick(){
		Socket.clearData()
	}
	handleSocketData(data){
		this.setState({
			countStart:Socket.datalen-data.trim().split(" ").length,
			countEnd:Socket.datalen,
		})
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
		let oldLayout=this.state.layouts.map((item)=>{
						if(item.x===0&&item.y===0){
							return Object.assign(item,{x:1,y:1});
						}else{
							return item;
						}
					})
		this.comps.push(
			<div  id={this.id} key={String(this.id)}>
				{comp}
			</div>
			);

		this.setState({
			layouts:[{
							x: 0,
							y: 0,
							w: 1,
							h: comp.props.h,
							minH:comp.props.h,
							i: String(this.id)
					},...oldLayout],
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
	handleMovableChange(event, { name, value, checked }){
		this.setState({
			movable:checked
		})
	}
	onLayoutChange(x){
		this.setState({
			layouts:x
		})
	}
	onHistoryClick(e){
		Socket.QueryHistory(e.target.innerText)
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
							<Menu.Item name="Count"	>
							  <CountUp start={this.state.countStart} end={this.state.countEnd} duration={1}/>
							</Menu.Item>

		          <Menu.Menu position='right'>
								<Dropdown text='Load History' scrolling pointing className='link item' >
									<Dropdown.Menu onClick={this.onHistoryClick.bind(this)}>
										<Dropdown.Item>A</Dropdown.Item>
										<Dropdown.Item>B</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
		          	<Menu.Item>
		            	{connectedIcon}
 								</Menu.Item>
		        	</Menu.Menu>
		        </Menu>

		        <div style={{position:"relative"}}>
		         <ResponsiveReactGridLayout className="layout"
		         	  layouts={{xxs:this.state.layouts}}
		         	  autoSize={true}
		         	  onLayoutChange={this.onLayoutChange.bind(this)}
			          rowHeight={1}
				      breakpoints={{lg: 0, md: 0, sm: 0, xs: 0, xxs: 0}}
				      cols={{lg: 2, md: 2, sm: 2, xs: 2, xxs: 2}}
				      draggableCancel='.nodrag'
				      >

				      {this.comps}
			    </ResponsiveReactGridLayout>
				</div>
		        <NotificationSystem ref="notificationSystem" />
	    	</div>
	    )
  	}
}
