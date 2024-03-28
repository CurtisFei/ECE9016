import React, { useState } from 'react'
import {Breadcrumb} from 'antd';
import {Typography,Table,Space} from 'antd';
import {Component} from 'react';
import {Input, Modal,message} from 'antd';
import axios from 'axios';
import { EditOutlined, DeleteOutlined, YoutubeOutlined } from "@ant-design/icons";
import { blue, red } from "@mui/material/colors";


const {Search} = Input
const {Title} = Typography;



function SearchTrackContent() {
  const [TrackData, setTrackData] = useState([]);
  const [innerTrackData, setInnerTrackData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onPlay = (record) => {
    window.open("https://www.youtube.com/results?search_query=" + record.track_title);
  };

  const onSearchByid = async (value) => {
    console.log("id is :" + value);
    if(value == ''){
      message.error("Input is Empty, please correct your input")
      return;
    }
    else{
    const res = await axios.get("/v1/track/search",{
      params:{
        count :2000,
        page: 0,
        track_id : value
      }
    })
    .then((res)=>{
      setTrackData(
        res.data.items.map(row => ({
          key: row.track_id,
          track_title: row.track_title,
          track_id: row.track_id,
          album_id :row.album_id,
          album_title: row.album_title,
          artist_id: row.artist_id,
          artist_name: row.artist_name,
          bit_rate: row.bit_rate,
          track_date_created: row.track_date_created,
          track_date_recorded: row.track_date_recorded,
          track_disc_number: row.track_disc_number,
          track_duration: row.track_duration,
          track_genres: row.track_genres,
          track_number: row.track_number,
          bit_rate: row.bit_rate,
          tags :row.tags,
      }))
      );

    }).catch((err)=>{
        console.log(err);
    })
    }
  }

  const onSearchByTitle = async (value) => {
    console.log("title is: "+ value);
    if( value == ''){
      message.error("Input is Empty, please correct your input")
      return;
    }
    else{
    const res = await axios.get("/v1/track/search",{
      params:{
        count :1000,
        page: 0,
        track_title : value
      }
    })
    .then((res)=>{
        //  res.data.items.forEach(element => {
        //   console.log(element)
        //  });
      setTrackData(
        res.data.items.map(row => ({
          key: row.track_id,
          track_title: row.track_title,
          track_id: row.track_id,
          album_id :row.album_id,
          album_title: row.album_title,
          artist_id: row.artist_id,
          artist_name: row.artist_name,
          bit_rate: row.bit_rate,
          track_date_created: row.track_date_created,
          track_date_recorded: row.track_date_recorded,
          track_disc_number: row.track_disc_number,
          track_duration: row.track_duration,
          track_genres: row.track_genres,
          track_number: row.track_number,
          bit_rate: row.bit_rate,
          tags :row.tags,
      }))
      );
      
    
    }).catch((err)=>{
        console.log(err);
    })
  }
  }

  const onSearchByAlbum = async (value) => {
    console.log("title is: "+ value);
    if( value == ''){
      message.error("Input is Empty, please correct your input")
      return;
    }
    else{
    const res = await axios.get("/v1/track/search",{
      params:{
        count :1000,
        page: 0,
        album_title : value
      }
    })
    .then((res)=>{
        //  res.data.items.forEach(element => {
        //   console.log(element)
        //  });
      setTrackData(
        res.data.items.map(row => ({
          key: row.track_id,
          track_title: row.track_title,
          track_id: row.track_id,
          album_id :row.album_id,
          album_title: row.album_title,
          artist_id: row.artist_id,
          artist_name: row.artist_name,
          bit_rate: row.bit_rate,
          track_date_created: row.track_date_created,
          track_date_recorded: row.track_date_recorded,
          track_disc_number: row.track_disc_number,
          track_duration: row.track_duration,
          track_genres: row.track_genres,
          track_number: row.track_number,
          bit_rate: row.bit_rate,
          tags :row.tags,
      }))
      );
      
    
    }).catch((err)=>{
        console.log(err);
    })
  }
  }


  const onSearchByArtist = async (value) => {
    // console.log(document.getElementById("track_id").value)
    // let track_id = 0;
    // let track_title = "";
    // let album_title = "";
    // let artist_name = "";
    let params = new Object();
    params.count = 1000;
    params.page = 0;

    if(document.getElementById("track_id").value != ""){
      // track_id = track_id;
      params.track_id = document.getElementById("track_id").value;
    }
    if(document.getElementById("track_title").value != ""){
      // track_title = track_title;
      params.track_title = document.getElementById("track_title").value ;
    }
    if(document.getElementById("album_title").value != ""){
      // album_title = album_title;
      params.album_title = document.getElementById("album_title").value;
    }
    if(document.getElementById("artist_name").value != ""){
      // artist_name = artist_name;
      params.artist_name = document.getElementById("artist_name").value;
    }

    
    const res = await axios.get("/v1/track/search",{
      params
    })
    .then((res)=>{
        //  res.data.items.forEach(element => {
        //  console.log(element)
        //  });
      setTrackData(
        res.data.items.map(row => ({
          key: row.track_id,
          track_title: row.track_title,
          track_id: row.track_id,
          album_id :row.album_id,
          album_title: row.album_title,
          artist_id: row.artist_id,
          artist_name: row.artist_name,
          bit_rate: row.bit_rate,
          track_date_created: row.track_date_created,
          track_date_recorded: row.track_date_recorded,
          track_disc_number: row.track_disc_number,
          track_duration: row.track_duration,
          track_genres: row.track_genres,
          track_number: row.track_number,
          bit_rate: row.bit_rate,
          tags :row.tags,
      }))
      );
      
    }).catch((err)=>{
        console.log(err);
    })
  }


const columns = [
  {
    title: 'track_title',
    dataIndex: 'track_title',
    key: 'track_title',
  },
  {
    title: 'track_id',
    dataIndex: 'track_id',
    key: 'track_id',
  },
  {
    title: 'album_id',
    dataIndex: 'album_id',
    key: 'album_id',
  },
  {
    title: 'album_title',
    dataIndex: 'album_title',
    key: 'album_title',
  },
  {
    title: 'artist_id',
    dataIndex: 'artist_id',
    key: 'artist_id',
  },
  {
    title: 'artist_name',
    dataIndex: 'artist_name',
    key: 'artist_name',
  },
  {
    title: 'bit_rate',
    dataIndex: 'bit_rate',
    key: 'bit_rate',
  },
  {
    title: 'track_date_created',
    dataIndex: 'track_date_created',
    key: 'track_date_created',
  },
  {
    title: 'track_date_recorded',
    dataIndex: 'track_date_recorded',
    key: 'track_date_recorded',
  },
  {
    title: 'Action',
    dataIndex: '',
    key: 'x',
    render: (text, record) => {
      return (
        <>
          <YoutubeOutlined onClick={()=>{
            onPlay(record);
          }} style={{ color: red[600] }} />
          
        </>
      );
    },
  }
];

  const innerTable = [
    {
      title: 'track_disc_number',
      dataIndex: 'track_disc_number',
      key: 'track_disc_number',
    },
    {
      title: 'track_duration',
      dataIndex: 'track_duration',
      key: 'track_duration',
    },
    {
      title: 'track_genres',
      dataIndex: 'track_genres',
      key: 'track_genres',
    },
    {
      title: 'track_number',
      dataIndex: 'track_number',
      key: 'track_number',
    },
    {
      title: 'bit_rate',
      dataIndex: 'bit_rate',
      key: 'bit_rate',
    },
    {
      title: 'tags',
      dataIndex: 'tags',
      key: 'tags',
    }
  ]




  return (
 
      <div className='PageContent' style={{
        minHeight:50,
        marginBottom:100,
        clear:'both'
      }}>

        <Breadcrumb>
          <Breadcrumb.Item>
            <a href="/HomeContent">Meta Music App</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="/SearchTrackContent">Tracks List Search</a>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Title
          level={2}
          style={{
          marginLeft: 55,
          marginTop: 30
        }}>Music Tracks Search:</Title>
        

        <div className='InputField'>
        <Title
          level={4}
          style={{
          marginLeft: 55,
          marginTop: 30
        }}>Search Tracks by attributes</Title>

        
          <Input
            id="track_id"
            placeholder="input Tracks Id"
            size="large"
            style={{
            width: "50%",
            marginLeft: 50,
            marginTop : 20
          }}/>
          
          
          <Input
            id="track_title"
            placeholder="input Tracks Title"
            size="large"
            style={{
            width: "50%",
            marginLeft: 50,
            marginTop : 20
          }}/>
          
          <Input
            id="album_title"
            placeholder="input Tracks Albums name"
            // enterButton="Search"
            size="large"
            onSearch={onSearchByAlbum}
            style={{
              width: "50%",
            marginLeft: 50,
            marginTop : 20
          }}/>

          <Search
            id="artist_name"
            placeholder="input Tracks Artist name"
            size="large"
            onSearch={onSearchByArtist}
            style={{
              width: "50%",
            marginLeft: 50,
            marginTop : 20
          }}/>
        </div>

        <div className='TrackTable'>
        <Table
          columns={columns}
          expandable={{
            rowExpandable: (record) => true,
          expandedRowRender: (record,i) => {
            const data = [];
            data.push(record);
            return (
              <Table
                columns={innerTable}
                dataSource={data}
                pagination={false}
              />
            );
          },
    }}
    pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10']}}
    dataSource={TrackData}
    
    
    style={{
      margin:50
    }}
  />
        </div>
        
      </div>
  )
}

export default SearchTrackContent;