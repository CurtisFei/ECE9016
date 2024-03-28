import React from "react";
import { Breadcrumb, List, Avatar, Rate, message, Table, Button, Form, Input, Typography, Select, Modal } from "antd";
import { YoutubeOutlined, FileOutlined } from "@ant-design/icons";
import axios from "axios";
import { LoginStates } from "../App.js";
import { blue, red } from "@mui/material/colors";
import { useState, useContext, useEffect} from "react";

const { Title } = Typography;

const desc = ["terrible", "bad", "normal", "good", "wonderful"];

function DisplayPlaylistContent() {
  const [rating, setRating] = useState(3);
  const {isLogin, setLogin } = useContext(LoginStates);
  const {groupID, setGroupID} = useContext(LoginStates);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playlistData, setPlaylistData] = useState([]);
  const [playlistOptions, setPlaylistOptions] = useState([]);
  const [playlistNameOptions, setPlaylistNameOptions] = useState([]);
  const [playlistReviewData, setPlaylistReviewData] = useState([])
  const [Token, setToken] = useState(
    window.localStorage.getItem("access_token")
  );

  // call the functions to display playlist
  useEffect(() => {
    getPlaylistData();
  }, []);

  // function getPlaylistData
  const getPlaylistData = async () => {
    await axios
      .get("/v1/playlist/getPlaylistStatistics", {
        params: { count: 20, page: 0 },
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        setPlaylistOptions(
          res.data.items.map((row) => ({
            value: row.id,
            label: row.name,
          }))
        );
        setPlaylistNameOptions(
          res.data.items.map((row) => ({
            value: row.name,
            label: row.name,
          }))
        );
        setPlaylistData(
          res.data.items.map((row) => ({
            key: row.id,
            name: row.name,
            numbers: row.track_number,
            totalPlaytime: row.total_playtime,
            creator: row.creator,
            averageRating: row.rating,
            tracks_info: row.tracks_info,
            description: row.description
          }))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // define the columns and nestedColumns for table
  const columns = [
    {
      key: "1",
      title: "Name",
      dataIndex: "name",
      // sorter: (a, b) => a.name - b.name,
    },
    {
      key: "2",
      title: "Tracks Numbers",
      dataIndex: "numbers",
      // sorter: (a, b) => a.numbers - b.numbers,
    },
    {
      key: "3",
      title: "Total Playtime",
      dataIndex: "totalPlaytime",
      // sorter: (a, b) => a.length - b.length,
    },
    {
      title: "Creator",
      dataIndex: "creator",
    },
    {
      key: "4",
      title: "Average Rating",
      dataIndex: "averageRating",
    },
    {
      key: "5",
      title: "Description",
      dataIndex: "description",
      render: (text, record) => {
        return (
          <>
          <FileOutlined  
            onClick={() => {
              onShowDescription(record);
            }}
              style={{ color: blue[600] }}
            />
          </>
        );
      },
    },
  ];
  const nestedColumns = [
    {
      key: "1",
      title: "Title",
      dataIndex: "track_title",
    },
    {
      key: "2",
      title: "Artist",
      dataIndex: "artist_name",
    },
    {
      key: "3",
      title: "Album",
      dataIndex: "album_title",
    },
    {
      key: "4",
      title: "Playtime",
      dataIndex: "track_duration",
    },
    {
      key: "5",
      title: "Action",
      dataIndex: "play",
      key: "play",
      render: (text, record) => {
        return (
          <>
            <YoutubeOutlined
              onClick={() => {
                onPlay(record);
              }}
              style={{ color: red[600] }}
            />
          </>
        );
      },
    },
  ];

  const onPlay = (record) => {
    window.open(
      "https://www.youtube.com/results?search_query=" + record.track_title
    );
  };
  const onShowDescription = (record) => {
    Modal.info({
      title: "Show Descriptions:",
      content:record.description
    });
  }

  // function to display review
  const onDisplayReview = async(event) => {
    // console.log(event)
    await axios.get("/v1/review/getReviewByplaylistName", {
      params:{
        playlist_name: event
      }
    }).then((res) => {
      // console.log(res.data)
      setPlaylistReviewData(res.data.map((row)=>({
        key:row.id, title:row.reviewer_name, comment:row.content, rating:row.rating
      })))
    }).catch((err) => {
      console.log(err)
    })
  }

  // funciton add review
  const addReview = async(event) => {
    event.rating = rating*20;
    // console.log(event)

    if(!event.playlist){
      message.error("Invalid input!!! You must choose the playlist.");
    }

    Modal.confirm({
      title: "Are you sure to add the review to the playlist?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        axios.post("/v1/review/addReviewByplaylistId", {
          playlist_id: event.playlist,
          rating: event.rating,
          comment: event.comment
        },{
          headers:{
            Authorization: `Bearer ${Token}`,
          }
        }).then((res) => {
          if (res.data) {
              message.success(res.data.message);
          }
          getPlaylistData();
        }).catch((err) => {
          console.log(err)
            message.error("You've already reviewed this playlist!");
        })
      },
    });
  }

  const requestReview = (item)=>{
    console.log(item)
    Modal.confirm({
      title: "Are you sure to sent the request?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        axios.post("/v1/review/updateReviewContestedByID", {
          review_id: item.key,
          is_contested: 1,
          type: "request"
        },{
          headers:{
            Authorization: `Bearer ${Token}`,
          }
        }).then((res) => {
          if (res.data) {
              message.success(res.data.message);
          }
          getPlaylistData();
        }).catch((err) => {
          console.log(err)
        })
      },
    });
  }
  const noticeReview = (item)=>{
    Modal.confirm({
      title: "Are you sure to sent the notice?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        axios.post("/v1/review/updateReviewContestedByID", {
          review_id: item.key,
          is_contested: 1,
          type: "notice"
        },{
          headers:{
            Authorization: `Bearer ${Token}`,
          }
        }).then((res) => {
          if (res.data) {
              message.success(res.data.message);
          }
          getPlaylistData();
        }).catch((err) => {
          console.log(err)
        })
      },
    });
  }
  const disputeReview = (item)=>{
    Modal.confirm({
      title: "Are you sure to sent the dispute?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        axios.post("/v1/review/updateReviewContestedByID", {
          review_id: item.key,
          is_contested: 1,
          type: "dispute"
        },{
          headers:{
            Authorization: `Bearer ${Token}`,
          }
        }).then((res) => {
          if (res.data) {
              message.success(res.data.message);
          }
          getPlaylistData();
        }).catch((err) => {
          console.log(err)
        })
      },
    });
  }

  return (
    <div
      style={{
        minHeight: 100,
        marginBottom: 400,
        clear: "both",
      }}
    >
      <Breadcrumb>
        <Breadcrumb.Item>
          <a href="/HomeContent">Meta Music App</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/DisplayPlaylistContent">Public Play List</a>
        </Breadcrumb.Item>
        {(groupID > 0) ? (
          <Breadcrumb.Item>
            <a href="/CreatePlaylistContent">My Space</a>
          </Breadcrumb.Item>
        ) : (
          <></>
        )}
      </Breadcrumb>

      <Title
        level={3}
        style={{
          marginLeft: 55,
          marginTop: 40,
        }}
      >
        Display Playlist
      </Title>

      <Table
        style={{
          width:"95%",
          marginLeft:"3%"
        }}
        columns={columns}
        dataSource={playlistData}
        expandable={{
          rowExpandable: (record) => true,
          expandedRowRender: (record) => {
            return (
              <Table
                columns={nestedColumns}
                dataSource={record.tracks_info}
                pagination={false}
              />

            );
          },
        }}
        pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10']}}
        size="middle"
      />
      
        <Title
            level={3}
            style={{
              marginLeft: 5,
              marginTop: 30,
              marginLeft: 50
            }}
          >
            Display Review{" "}
          </Title>
          <Select
            name="playlist"
            placeholder="--choose playlist--"
            style={{
              width: 180,
              marginLeft: 50
            }}
            allowClear
            options={playlistNameOptions}
            onChange={onDisplayReview}
          />
          <List
            itemLayout="horizontal"
            dataSource={playlistReviewData}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <a onClick={()=>{requestReview(item)}} key="list-loadmore-edit">request</a>,
                  <a onClick={()=>{noticeReview(item)}} key="list-loadmore-edit">notice</a>,
                  <a onClick={()=>{disputeReview(item)}} key="list-loadmore-more">dispute</a>,
                ]}
              >
                <List.Item.Meta
                  // avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                  title={<a href="#">{item.title}</a>}
                  description={<p>{item.comment}</p>}
                  style={{
                    marginLeft:40
                  }}
                />
              </List.Item>
            )}
          />

      {(groupID > 0) ? (
        <div
          style={{
            marginLeft: 50,
          }}
        >
          <Title
            level={3}
            style={{
              marginLeft: 5,
              marginTop: 30,
            }}
          >
            Add Review
          </Title>

          <Form onFinish={addReview}>
            <Form.Item name="playlist">
              <Select
              placeholder="--choose playlist--"
              style={{
                width: 180,
                // marginLeft: 50,
              }}
              allowClear
              options={playlistOptions}
            />
            </Form.Item>
            <Form.Item name="rating">
              <span>
                <Rate tooltips={desc} onChange={setRating} value={rating} />
                {rating ? (
                  <span className="ant-rate-text">{desc[rating - 1]}</span>
                ) : (
                  ""
                )}
              </span>
            </Form.Item>
            <Form.Item name="comment">
              <Input.TextArea
                style={{
                  width: 1200,
                }}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>

          {/* <Modal title="Description" open={isModalOpen} onCancel={handleCancel}>
            <p>Some contents...</p>
          </Modal> */}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default DisplayPlaylistContent;
