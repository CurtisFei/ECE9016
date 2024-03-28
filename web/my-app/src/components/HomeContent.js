import React from 'react'
import {Space, Typography, Switch, Divider} from 'antd';

import background from '../images/Banner.jpg'

const { Paragraph, Text } = Typography;




function HomeContent() {

    const contentStyle = {
      height: '600px',
      color: '#fff',
      textAlign: 'center',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      fontSize: 100,
    };
    const contentStyle1 = {...contentStyle,...{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${background})`}};
    const [ellipsis, setEllipsis] = React.useState(true);
    const [disabled, setDisabled] = React.useState(true);

    return (
      <div className='PageContent'>

      <div className='paragraph' style={{textAlign: "center", paddingBottom:400, fontSize:20}}>
        <div>
          <h3 style={contentStyle1} > Meta Music App </h3>
        </div>
        <Divider>What is Meta Music App</Divider>

        <Switch
          checked ={!disabled}
          onChange={()=>{setDisabled(!disabled)}}/>
        
        <Paragraph style={{marginLeft:200,marginRight:200}} ellipsis = {disabled}>
        Meta music app is a music application that allow users to search, play tracks that from the internet open resources. The meta music stored and category over 1500 tracks that belongs to different albums, artists and genres. User could also save tracks
        to the personal play list after they logged in. Comment on the playlist. share the idea of the public play list. It is free for all users to sign up. 
        </Paragraph>

        <Divider>How Do I contribute to this project</Divider>
        <Switch
            checked ={!ellipsis}
                onChange={()=>{setEllipsis(!ellipsis)}}/>

        <Paragraph style={{marginLeft:200,marginRight:200}} ellipsis = {disabled}>
        
        The link for github: https://github.com/CurtisFei/ece9065-yfei55-hwei47-szhou379-lab4. For everyone that is willing to contribute to our project.
        </Paragraph>

        <Divider>Who are We</Divider>
        <Space direction='vertical'></Space>
        <Text strong>We are a group of three members creating this helpful website :)</Text>

        </div>
      </div>      
    )
}


export default HomeContent
