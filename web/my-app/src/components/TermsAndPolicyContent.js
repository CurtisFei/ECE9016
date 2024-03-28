import React from "react";
import { Breadcrumb, Row, Col, Typography } from "antd";
import { FileOutlined } from "@ant-design/icons";
import axios from "axios";
const { Title, Paragraph, Text, Link } = Typography;

function TermsAndPolicyContent() {
  const getFile = async (filename) => {
    await axios
      .post("/v1/policy/getFile", {
        filename: filename,
      })
      .then((res) => {
        document.getElementById("content").innerHTML = res.data.data;
        document.getElementById("fileName").innerHTML =  filename;
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
  };

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <a href="/HomeContent">Meta Music App</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/TermsAndPolicyContent">Display Terms and Policy</a>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginTop: 40 }}>
        <Col span={2}></Col>
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


        <Col span={14}>

          <Typography>
          <Title level={2} id="fileName"></Title>
            <Paragraph id="content"></Paragraph>

          </Typography>

        </Col>


        <Col span={2}></Col>
      </Row>
    </>
  );
}

export default TermsAndPolicyContent;
