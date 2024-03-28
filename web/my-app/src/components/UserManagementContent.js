import React from "react";
import { Breadcrumb, List, Avatar, Rate, message, Table, Button, Form, Input, Typography, Select, Modal } from "antd";
import { CloseCircleOutlined, CheckCircleOutlined, UsergroupAddOutlined,UsergroupDeleteOutlined, YoutubeOutlined, FileOutlined, UndoOutlined, RedoOutlined} from "@ant-design/icons";
import { blue, red } from "@mui/material/colors";
import { useState, useContext, useEffect} from "react";
import axios from "axios";

const { Title } = Typography;

function UserManagementContent() {
  const [userData, setUserData] = useState([]);
  const [Token, setToken] = useState(
    window.localStorage.getItem("access_token")
  );

  const columns = [
    {
      key: "1",
      title: "User ID",
      dataIndex: "id",
    },
    {
      key: "2",
      title: "Username",
      dataIndex: "username",
    },
    {
      key: "3",
      title: "Identity",
      dataIndex: "identity",
    },
    {
      key: "4",
      title: "Status",
      dataIndex: "status",
      render:(text, record)=>{
        return(
          <>
            {(record.status == 1)?
              <p>activate</p>
            :
              <p>deactivate</p>
            }
          </>
        )
      }
    },
    {
      key: "5",
      title: "Permission",
      dataIndex: "action",
      render:(text, record)=>{
        return(
          <>
         <UsergroupDeleteOutlined
              onClick={() => {onDisgrantedPermission(record)}}  
              style={{ color: red[500]}}/>

            <UsergroupAddOutlined
              onClick={() => {onGrantedPermission(record)}}
              style={{ color: blue[600], marginLeft:20}}
            />
          </>
        )
      }
    }
    ,
    {
      key: "6",
      title: "Activate",
      dataIndex: "action",
      render:(text, record)=>{
        return(
          <>
         <CloseCircleOutlined 
              onClick={() => {onDeactivateUser(record)}}  
              style={{ color: red[500]}}/>

            <CheckCircleOutlined 
              onClick={() => {onActivateUser(record)}}
              style={{ color: blue[600], marginLeft:20}}
            />
          </>
        )
      }
    }
  ]

  const onGrantedPermission = (record)=>{
    Modal.confirm({
      title: "Are you sure to give this user admin privilege",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        axios.put("/cms/admin/user/" + record.id, {
          status: 1,
          group_ids:[1]
        },{
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }).then((res)=>{
          // console.log(res)
          getUserData();
        }).catch((err)=>{
          console.log(err)
        })
        }
    })
  }

  const onDisgrantedPermission = (record)=>{
    Modal.confirm({
      title: "Are you sure to remove this user admin privilege?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        axios.put("/cms/admin/user/" + record.id, {
          status: 1,
          group_ids:[2]
        },{
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }).then((res)=>{
          // console.log(res)
          getUserData();
        }).catch((err)=>{
          console.log(err)
        })
        }
    })
  }

  const onDeactivateUser = (record)=>{
    Modal.confirm({
      title: "Are you sure to deactivate the user?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        axios.put("/cms/admin/user/" + record.id, {
          status:0,
          group_ids:[2]
        },{
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }).then((res)=>{
          // console.log(res)
          getUserData();
        }).catch((err)=>{
          console.log(err)
        })
        }
    })
  }

  const onActivateUser = (record)=>{
    Modal.confirm({
      title: "Are you sure to activate the user?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        axios.put("/cms/admin/user/" + record.id, {
          status: 1,
          group_ids:[2]
        },{
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }).then((res)=>{
          // console.log(res)
          getUserData();
        }).catch((err)=>{
          console.log(err)
        })
        }
    })
    
  }

  // call the functions to display playlist
  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = () =>{
    axios.get("/cms/admin/users", {
      params: { count: 20, page: 0 },
      headers: {
        Authorization: `Bearer ${Token}`,
      },
    }).then((res)=>{
      console.log(res.data.items);
      // console.log(res.data.items[0].groups[0])
      setUserData(res.data.items.map((row)=>({
        key:row.id,
        id:row.id,
        username:row.username,
        identity:row.groups[0].name,
        status: row.status
      })))
    }).catch((err)=>{
      console.log(err);
    })
  }

  return(
    <div>
    <Title
      level={3}
      style={{
        marginLeft: 55,
        marginTop: 40,
      }}
    >  
      Display Users
    </Title>
    
    <Table
      style={{
        width:"90%",
        marginLeft:"5%"
      }}
      columns={columns}
      dataSource={userData}
      pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['5','10']}}
      size="middle"
    />
{/*     
    <Title
      level={3}
      style={{
        marginLeft: 55,
        marginTop: 40,
      }}
    >  
      Policy Items
    </Title> */}
    
  </div>
  )
}
export default UserManagementContent;