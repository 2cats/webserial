import React, { Component } from 'react'
import { Menu,Segment ,Input ,Button,Grid,Card,Checkbox,Form ,Dropdown,Icon} from 'semantic-ui-react'
import Socket from './Socket'
import DeleteButton from './DeleteButton'
import Style from './Style'
export default class Filter extends Component {
	constructor(props){
		super(props);
		this.state = {
			content:[],
			start:"",
			end:"",
			errStart:true,
			errEnd:true,
			hex:false,
			unicode:false,
		}
		Socket.onData(this.updateFilter.bind(this));
	}
	updateFilter(){
		let startHexString=Socket.rawString2HexString(this.state.start);
		let endHexString=Socket.rawString2HexString(this.state.end);
	    if (!startHexString) {
	    	this.setState({errStart:true})
	    }else{
	    	this.setState({errStart:false})
	    }
	    if (!endHexString) {
	    	this.setState({errEnd:true})
	    }else{
	    	this.setState({errEnd:false})
	    }
		let hexstring=Socket.data;
		let regTrue=new RegExp(`${startHexString}([\x00-\xff]+?)${endHexString}`,'g')
		let matchStr=hexstring.match(regTrue);

		if(!matchStr || !this.state.start || !this.state.end){
			this.setState({
				content:[],
			})
			return;
		}
		//console.log(matchStr);
		matchStr=matchStr.map((data)=>{
			let hex_str=data.substring(startHexString.length,data.length-endHexString.length).trim()
			if (this.state.hex) {
				return hex_str
			}
			if(this.state.unicode){
				let hexs=hex_str.split(" ")
				if (hexs.length%2===0) {
					let evalSrc="\'"
					for (var i = 0; i <hexs.length; i+=2) {
						evalSrc= evalSrc + "\\u"+ hexs[i] +  hexs[i+1];
					}
					evalSrc+="\'"
					return eval(evalSrc)
				}else{
					return "Unicode Parse Error:\n"+hex_str
				}
			}else{
				return Socket.hexString2ASCII(hex_str);
			}

		})

		this.setState({
			content:matchStr,
		})
	}
	handleUnicodeChange(event, { name, value, checked }){
		this.setState({
			unicode:checked
			},this.updateFilter.bind(this)
		)
	}
	handleHexChange(event, { name, value, checked }){
		this.setState({
			hex:checked
			},this.updateFilter.bind(this)
		)
	}
	render(){
		let contentComp=[];
		for (let i in this.state.content){
			contentComp.push(
					<Segment>
					     <pre style={Style.pre}>
				         		{this.state.content[i]}
				         </pre>
				  </Segment>
				)
		}

		if (contentComp.length>0) {
			contentComp=(
				<Segment.Group >
					{contentComp}
				</Segment.Group>
			)
		}else{
			contentComp=""
		}
		return (
<div  className={this.props.className}  style={{position:"relative",marginTop:"10px"}}>
 <Segment raised color='orange'>
	 <Segment>
	 	<div style={{display:'flex',flexGrow:'row',flexWrap:"wrap",marginBottom:"15px"}}>
			<Checkbox toggle checked={this.state.unicode} onChange={this.handleUnicodeChange.bind(this)} style={{marginLeft:"5px" ,marginRight:"5px",alignSelf:'center'}} label='Unicode'  />
			<Checkbox toggle checked={this.state.hex} onChange={this.handleHexChange.bind(this)} style={{marginLeft:"5px" ,marginRight:"5px",alignSelf:'center'}} label='Hex'  />
		</div>
		<div style={{display:'flex',width:"100%",flexGrow:'row',flexWrap:"wrap",marginBottom:"10px"}}>
				<Input  error={this.state.errStart} icon='mail forward' onChange={(e,obj)=>{this.setState({start:obj.value},this.updateFilter.bind(this))}} iconPosition='left' color='green' style={{marginRight:"10px" ,flexGrow:"1"}} placeholder='Start...' />
				<Input error={this.state.errEnd} icon='reply' onChange={(e,obj)=>{this.setState({end:obj.value},this.updateFilter.bind(this))}} color='red' iconPosition='right' style={{marginRight:"10px" ,flexGrow:"1"}} placeholder='End...' />
		</div>
	 </Segment>
	{contentComp}
</Segment>
<div style={{position:"absolute" ,top:"5px",right:"5px"}}>
	<DeleteButton {...this.props}/>
</div>

		</div>






		)
	}
}
