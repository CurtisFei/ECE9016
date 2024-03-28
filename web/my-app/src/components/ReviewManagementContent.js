import React from "react";
import { Table, Typography, Modal, Row, Col, Input, Button, message} from "antd";
import { CloseCircleOutlined, CheckCircleOutlined, FileOutlined} from "@ant-design/icons";
import { blue, red } from "@mui/material/colors";
import { useState, useEffect} from "react";
import axios from "axios";

const { Title } = Typography;


function ReviewManagementContent() {
  const [playlistReviewData, setPlaylistReviewData] = useState([])
  const [modifiedFilename, setModifiedFilename] = useState("")
  const [Token, setToken] = useState(
    window.localStorage.getItem("access_token")
  );

  // define the columns and nestedColumns for table
  const columns = [
    {
      key: "1",
      title: "Reviewer",
      dataIndex: "reviewer_name",
    },
    {
      key: "2",
      title: "Playlist",
      dataIndex: "playlist_id",
    },
    {
      key: "3",
      title: "Comment",
      dataIndex: "content",
    },
    {
      key: "4",
      title: "date_request_received",
      dataIndex: "date_request_received",
    },
    {
      key: "5",
      title: "date_notice_sent",
      dataIndex: "date_notice_sent",
    },
    {
      key: "6",
      title: "date_dispute_received",
      dataIndex: "date_dispute_received",
    },
     {
      key: "7",
      title: "status",
      dataIndex: "status",
      render:(text, record)=>{
        return(
          <>
            {(record.status == 1)?
              <p>visible</p>
            :
              <p>invisible</p>
            }
          </>
        )
      }
    },
    {
      key: "8",
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
      
        return (
          <>
            <CloseCircleOutlined 
              onClick={() => {onHideReview(record)}}  
              style={{ color: red[500]}}/>

            <CheckCircleOutlined 
              onClick={() => {onPublicReview(record)}}
              style={{ color: blue[600], marginLeft:20}}
            />
          </>
        );
      },
    },
  ];

  // call the functions to display playlist
  useEffect(() => {
    getPlaylistReview();
  }, []);

  // function to display review
  const getPlaylistReview = async(event) => {
    // console.log(event)
    await axios.get("/v1/review", {
      headers: {
        Authorization: `Bearer ${Token}`,
      },
    }).then((res) => {
      // console.log(res.data)
      setPlaylistReviewData(res.data.map((row)=>({
        key:row.id,
        reviewer_name:row.reviewer_name,
        playlist_id:row.playlist_id,
        content: row.content,
        date_request_received: row.date_request_received,
        date_notice_sent: row.date_notice_sent,
        date_dispute_received: row.date_dispute_received,
        status: row.status,
        title:row.reviewer_name, comment:row.content, rating:row.rating
      })))
    }).catch((err) => {
      console.log(err)
    })
  }

  const onHideReview = (record) => {
    // console.log(record)
     Modal.confirm({
      title: "Are you sure to hide the review?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        axios.put("/v1/review/updateReviewStatusByID", {
          id:record.key,
          status:0
        },{
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }).then((res)=>{
          // console.log(res.data)
          getPlaylistReview();
        }).catch((err)=>{
          console.log(err);
        })
      },
    });
  }

  const onPublicReview = (record) => {
    // console.log(record)
    Modal.confirm({
      title: "Are you sure to public the review?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        axios.put("/v1/review/updateReviewStatusByID", {
          id:record.key,
          status:1
        },{
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }).then((res)=>{
          // console.log(res.data)
          getPlaylistReview();
        }).catch((err)=>{
          console.log(err);
        })
      },
    });
  }

  const getFile = async (filename) => {
    setModifiedFilename(filename)
    await axios
      .post("/v1/policy/getFile", {
        filename: filename,
      })
      .then((res) => {
        document.getElementById("content").value = res.data.data;
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
  };

  const updateFile = async()=>{
    // console.log(modifiedFilename)
    // console.log(document.getElementById("content").value)
    Modal.confirm({
      title: "Are you sure to update the policy?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        axios.post("/v1/policy/updatePolicy", {
          filename: modifiedFilename,
          content: document.getElementById("content").value
        },{
          headers: {
            Authorization: `Bearer ${Token}`,
          }
        }).then((res)=>{
          if (res.data) {
            setTimeout(() => {
              message.success(res.data.message);
            }, 2000);
          }
          getFile(modifiedFilename);
        }).catch((err)=>{
          console.log(err)
        })
      },
    });
  
  }



  return (
    <div>
      <Title
        level={3}
        style={{
          marginLeft: 55,
          marginTop: 40,
        }}
      >  
        Display Reviews
      </Title>
      
      <Table
        style={{
          width:"90%",
          marginLeft:"5%"
        }}
        columns={columns}
        dataSource={playlistReviewData}
        pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['5','10']}}
        size="middle"
      />
      
      <Title
        level={3}
        style={{
          marginLeft: 55,
          marginTop: 40,
        }}
      >  
        Policy Items
      </Title>

      <Row style={{ marginTop: 40 }}>
        <Col span={1}></Col>
        <Col span={6}>
          <ul>
            <li>
              <a onClick={() => getFile("SPP")}>
                <FileOutlined /> Security And Privacy Policy{" "}
              </a>
            </li>
            <li style={{ marginTop: 20 }}>
              <a onClick={() => getFile("N&TP")}>
                <FileOutlined /> DMCA Notice & Takedown Policy
              </a>
            </li>
            <li style={{ marginTop: 20 }}>
              <a onClick={() => getFile("AUP")}>
                <FileOutlined /> Acceptable Use Policy{" "}
              </a>
            </li>
            <li style={{ marginTop: 20 }}>
              <a onClick={() => getFile("workflow")}>
                <FileOutlined /> Workflow And Usage of tools{" "}
              </a>
            </li>
          </ul>
        </Col>
        <Col span={16}>
          <Input.TextArea id="content" style={{height:200}}>
              
          </Input.TextArea>

          <Button onClick={()=>updateFile()} type="primary" htmlType="submit" style={{ marginTop:10, marginLeft: "90%" }}>
            Submit
          </Button>
        </Col>
        <Col span={1}></Col>
      </Row>
      
    </div>
  );
}
export default ReviewManagementContent;
