import React from "react";
import { useState, useContext, useEffect } from "react";
import { Breadcrumb, Radio, message, Table, Button, Form, Input, Typography, Select, Modal } from "antd";
import { EditOutlined, DeleteOutlined, YoutubeOutlined, FileOutlined} from "@ant-design/icons";
import axios from "axios";
import { LoginStates } from "../App.js";
import { blue, red } from "@mui/material/colors";

const { Title } = Typography;

function CreatePlaylistContent() {
  // const {isLogin, setLogin} = useContext(LoginStates)
  const [isValidated, setValidation] = useState(true);
  // const [userEmail, setuserEmail] = useState(window.localStorage.getItem("email"))
  const [Token, setToken] = useState(
    window.localStorage.getItem("access_token")
  );
  const [playlistData, setPlaylistData] = useState([]);
  const [playlistOptions, setPlaylistOptions] = useState([]);
  const [trackIDsList, setTrackIDsList] = useState([]);
  const [trackDetailsList, setTrackDetailsList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPlaylst, setEditingPlaylist] = useState(null);
  const [playlistID, setPlaylistID] = useState(1);
  const [form] = Form.useForm();

  // function create playlist function
  const createPlaylist = async (e) => {
    if (e.playlistName) {
      setValidation(true);
    } else {
      setValidation(false);
    }

    if (isValidated) {
      // console.log(Token);
      const res = await axios
        .post(
          "/v1/playlist/create",
          {
            name: e.playlistName,
            description: e.description,
            status: 0,
          },
          {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        )
        .then((res) => {
          // console.log(res)
          if (res.data) {
            setTimeout(() => {
              message.success(res.data.message);
            }, 2000);
          }
        })
        .catch(function (error) {
          // console.log(error.response.data.message)
          setTimeout(() => {
            message.error(error.response.data.message);
          }, 2000);
        });
    }else{
      message.error("Invalid input!!! You must input the playlist name.");
    }
    getPlaylistData();
  };

  // function add tracks to a playlist
  const addTracks = async (e) => {
    // console.log(e)
    if (e.chosenPlaylist && e.tracks) {
      setValidation(true);
    } else {
      setValidation(false);
    }

    if (isValidated) {
      // console.log(Token);
      const res = await axios
        .put(
          "/v1/playlist/updateTracksByName",
          {
            name: e.chosenPlaylist,
            track_list: e.tracks.toString(),
          },
          {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        )
        .then((res) => {
          // console.log(res)
          if (res.data) {
              message.success(res.data.message);
          }
          getPlaylistData();
        })
        .catch(function (error) {
          // console.log(error.response.data.message)
            message.error(error.response.data.message);
        });
    }else{
      message.error("Invalid input!!! You must choose the playlist and tracks.");
    }
  };

  // call the functions to display playlist
  useEffect(() => {
    getPlaylistData();
    getAllTrackIDs();
  }, []);

  // function getPlaylistData
  const getPlaylistData = async () => {
    await axios
      .get("/v1/playlist/getPlaylistStatisticsByUser", {
        params: { count: 20, page: 0 },
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        setPlaylistOptions(
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
            description:row.description
          }))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // function getAllTrackIDs
  const getAllTrackIDs = async () => {
    await axios
      .get("/v1/track/getAllTrackIds")
      .then((res) => {
        // console.log(res.data)
        setTrackIDsList(
          res.data.map((row) => ({
            value: row,
            label: row,
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
    // {
    //   title: "Creator",
    //   dataIndex: "creator",
    // },
    {
      key: "4",
      title: "Average Rating",
      dataIndex: "averageRating",
    }, 
    {
      key: "6",
      title: "Action",
      dataIndex: "play",
      render: (text, record) => {
        return (
          <>
          <FileOutlined  
            onClick={() => {
              onShowDescription(record);
            }}
              style={{ color: blue[600] }}
            />
            <EditOutlined onClick={()=>{
              onEditPlaylist(record);
            }} style={{ color: blue[600], marginLeft: 20}} />
            <DeleteOutlined
              onClick={() => {
                onDeletePlaylist(record);
              }}
              style={{ color: red[500], marginLeft: 20 }}
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
            <YoutubeOutlined onClick={()=>{
              onPlay(record);
            }} style={{ color: red[600] }} />
            {/* <DeleteOutlined onClick={()=>{
              onDeleteTrack(record);
            }} style={{ color: red[500], marginLeft: 20 }} /> */}
          </>
        );
      },
    },
  ];
  const onChange = (pagination, filters, sorter, extra) => {
    // console.log("params", pagination, filters, sorter, extra);
  };

  const onShowDescription = (record) => {
    Modal.info({
      title: "Show Descriptions:",
      content:record.description
    });
  }
  const onDeletePlaylist = (record) => {
    // console.log(record);
    Modal.confirm({
      title: "Are you sure to delete the playlist?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        axios
          .delete("/v1/playlist/" + record.name, {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
        setPlaylistData((pre) => {
          return pre.filter((playlist) => playlist.name !== record.name);
        });
      },
    });
  };
  const onEditPlaylist = (record) => {
    setIsEditing(true);
    console.log(record)
    setPlaylistID(record.key);
    // setEditingPlaylist({...record});
  };

  const onUpdatePlaylist = (event) => {
    let params = new Object();

    params.id = playlistID;

    if(event.name){
      params.name = event.name;
    }
    if(event.description){
      params.description = event.description;
    }
    if(event.tracks){
      params.track_list = event.tracks.toString();
    }
    if(event.status){
      params.status = event.status;
    }

    Modal.confirm({
      title: "Are you sure to update the playlist?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        axios.put("/v1/playlist/updatePlaylistById", params,{
          headers: {
            Authorization: `Bearer ${Token}`,
          }
        }).then((res)=>{
          if (res.data) {
            setTimeout(() => {
              message.success(res.data.message);
            }, 1000);
          }
          getPlaylistData();
        }).catch((err)=>{
          console.log(err)
        })
      },
    });
  }

  const onPlay = (record) => {
    window.open("https://www.youtube.com/results?search_query=" + record.track_title);
  };
  // const onDeleteTrack = (record) => {
  //   Modal.confirm({
  //     title: "Are you sure to delete the track?",
  //     okText: "Yes",
  //     okType: "danger",
  //     onOk: () => {
  //       pre.filter((playlist) => playlist.name !== record.name);
  //       // axios
  //       //   .delete("" + record.name, {
  //       //     headers: {
  //       //       Authorization: `Bearer ${Token}`,
  //       //     },
  //       //   })
  //       //   .then((res) => {
  //       //     console.log(res);
  //       //   })
  //       //   .catch((err) => {
  //       //     console.log(err);
  //       //   });
  //       // setPlaylistData((pre) => {
  //       //   return pre.filter((playlist) => playlist.name !== record.name);
  //       // });
  //     },
  //   });
  // }
  const options = [];

  const handleChange = (value) => {
    // console.log(`Selected: ${value}`);
  };

  return (
    <div
      className="content"
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
        <Breadcrumb.Item>
          <a href="/CreatePlaylistContent">My Space</a>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Form onFinish={createPlaylist}>
        <Form.Item>
          <Title
            level={3}
            style={{
              marginLeft: "3%",
              marginTop: 40,
            }}
          >
            Create Playlist
          </Title>
        </Form.Item>
        <Form.Item id="playlistName" name="playlistName">
          <Input
            placeholder="create playlist"
            style={{
              width: "80%",
              marginLeft: "3%",
            }}
          />
        </Form.Item>
        <Form.Item id="description" name="description">
          <Input.TextArea
            placeholder="enter description"
            autoSize={{
              minRows: 3,
              maxRows: 5,
            }}
            style={{
              width: "80%",
              marginLeft: "3%",
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginLeft: "3%" }}>
            Submit
          </Button>
        </Form.Item>
      </Form>

      <Form onFinish={addTracks}>
        <Title
          level={3}
          style={{
            marginLeft: "3%",
            marginTop: 40,
          }}
        >
          Add Tracks
        </Title>
        <Form.Item name="chosenPlaylist">
          <Select
            placeholder="--choose playlist--"
            style={{
              width: "30%",
              marginLeft: "3%",
            }}
            allowClear
            options={playlistOptions}
          />
        </Form.Item>
        <Form.Item
          id="tracks"
          name="tracks"
          rules={[{ type: "array", message: "" }]}
        >
          <Select
            mode="multiple"
            size="middle"
            placeholder="Please select"
            defaultValue={[]}
            onChange={handleChange}
            style={{
              width: "80%",
              marginLeft: "3%",
            }}
            options={trackIDsList}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginLeft: 50 }}>
            Submit
          </Button>
        </Form.Item>
      </Form>

      <Title
        level={3}
        style={{
          marginLeft: "3%",
          marginTop: 40,
        }}
      >
        Display My Playlist
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
        size="middle"
      />

      <Modal
        title="Edit Playlist"
        open={isEditing}
        okText="Save"
        onOk={(record) => {
          form.submit();
          setIsEditing(false);
        }}
        onCancel={() => {
          form.resetFields();
          setIsEditing(false);
        }}
      > 
        <Form form={form} onFinish={onUpdatePlaylist}>
          <b>modify name</b> 
          <Form.Item name="name" id="updateName">
            <Input
              placeholder="enter playlist name"
            />
          </Form.Item>
           <b>modify description</b>
          <Form.Item name="description" id="updateDescription">
            <Input.TextArea
              placeholder="enter description"
            />
          </Form.Item>
          <b>choose tracks</b>
          <Form.Item name="tracks" id="updateTracks">
            <Select
              mode="multiple"
              size="middle"
              placeholder="Please select"
              options={trackIDsList}
            />
          </Form.Item>
          <b>choose status</b> 
          <Form.Item name="status" id="updateStatus">
            <Radio.Group onChange={onChange} >
              <Radio value={0}>Privacy</Radio>
              <Radio value={1}>Public</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CreatePlaylistContent;
