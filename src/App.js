import './App.css';
import 'antd/dist/antd.css'
import { v4 } from 'uuid'
import { useCookies } from 'react-cookie';
import { Upload, message, Button, Col, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import CONFIG from './constant';
import { useEffect, useState } from 'react';
import Text from 'antd/lib/typography/Text';

function App() {
  var [cookies, setCookie, removeCookie] = useCookies(['id']);
  var [data, setData] = useState([])
  var [upload, setUpload] = useState(false)
  var [currentIndex, setCurrentIndex] = useState(0)
  var [error, setError] = useState(0)
  var [isModalVisible, setIsModalVisible] = useState(false);
  if (!cookies.id) setCookie("id", v4())

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setCurrentIndex(0)
    setError(0)
    setIsModalVisible(false);
    Array.from(document.getElementsByTagName("p")).forEach(value => value.className="letter")
    
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const props = {
    name: 'file',
    action: `${CONFIG.SERVER_NAME}/upload`,
    headers: {
      "id": cookies.id
    },

    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        setUpload(true)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
      setCurrentIndex(0)
    },
    onRemove(info) {
      removeCookie('id')
      setUpload(false)
      setCurrentIndex(0)
    }

  };

  // const getStyleLetter = function (index){
  //   if(index === currentIndex){
  //     return 'letter-current'
  //   }
  //   else if(index > currentIndex){
  //     return 'letter'
  //   }
  //   else if(index < currentIndex){
  //     return 'letter-done'
  //   }
  // }


  const handleKeyPress = function(event){
    event.preventDefault()
    if(event.key && currentIndex === 0) {
      setTimeout(() => {
        showModal()
      }, 60000)
    }

    if(event.key === document.getElementById(`letter-${currentIndex}`).innerText) {
      document.getElementById(`letter-${currentIndex}`).className = 'letter-done'
      document.getElementById(`letter-${currentIndex +1 }`).className = 'letter-current'
      window.scrollTo({
        top: document.getElementById(`letter-${currentIndex +1 }`).offsetTop - 100,
        behavior:"smooth"
      })
      setCurrentIndex(currentIndex+1)
      
    }
    else{
      document.getElementById(`letter-${currentIndex}`).className = 'letter-wrong'
      setError(error + 1)
    }
    if(event.key && currentIndex > data.length){
      //clearInterval(timer)
    }
  }

  useEffect(() => {
    fetch(`${CONFIG.SERVER_NAME}/data`, {
      method: "GET",
      headers: {
        "id": cookies.id
      }
    }).then(res => res.arrayBuffer())
      .then(buff => Array.from(new Uint8Array(buff)).map(value => String.fromCharCode(value))
      )
      .then(data => setData(data))
      .catch(err => console.log(err))
  }, [upload])

  return (
    <div className="App" id={"app"} onKeyPress={handleKeyPress}  tabIndex={0}>
      <Col span={8} offset={8}>
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Col>
      <Col span={16} offset={4} className="paragraph" id={"paragraph"} >
        {data.map((value, index) =><p id={`letter-${index}`} className="letter">{value}</p>)}
      </Col>
      <Modal title="Information" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Text>You type <strong>{currentIndex/5}</strong> wpm with <strong>{error}</strong> errors.</Text>
      </Modal>
    </div>
  );
}

export default App;
