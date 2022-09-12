import { useEffect, useState } from 'react';
import './App.css';
import styled from "styled-components";
import { useRef } from 'react';

const shortid = require('shortid')

const Style = styled.div`
  section{
    border: black solid 3px;
    width: 70vh;
    height: 50vw;
    margin-top: 20%;
    margin-left: 20%;
    margin-bottom: 20%;
    border-radius: 5%;
    overflow: hidden;
  }

  .topbar{
    border: black solid 1px;
    background-color: #6E85B7;
    width: 100%;
    height: 8%;
    text-align: center;
    font-weight: bold;
    overflow: auto;
    font-size: 30px;
  }
  .mainarticle{
    overflow: scroll;
    border: black solid 1px;
    width:100%;
    height: 77%;
    background-color: #B2C8DF;
    &::-webkit-scrollbar{
      border: solid black 1.5px;
      border-radius: 2px;
      background-color: #C4D7E0;
    } 
  }

  .chatarticle{
    /* border: black solid 1px; */
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 15%;
    background-color: #6E85B7;
  }
  .input{
    border: solid black 2px;
    height: 100%;
    background-color: #6E85B7;
    width: 100%;
    font-size: 20px;
    font-weight: bold;
  }
  .postBtn{
    background-color:#F8F9D7;
  }
  .chatsection{
    margin-top: 10px;
    margin-right: 60%;
    margin-left: 10px;
    font-weight: bold;
    
  }
  .chatsection2{
    margin-top: 10px;
    margin-left: 60%;
    margin-right: 10px;
    font-weight: bold;
    

  .contentbox{
    display:flex;
    flex-direction:row;
  }

  }
  .chatcontent{
    width: 100%;
    height: 50%;
    border: black solid 2px;
    background-color: #F8F9D7;
    border-radius: 5%;
    padding: 10px;

  }
  #chatid{
    display:flex;
    flex-direction: row;
    justify-content: center;
  }
  .profileimg{
    width: 50px;
    height: 50px;
    flex-grow: 1,5;
    border-radius: 30%;
  }
  .profileMain{
    flex-grow: 2;
    border-radius: 10%;
  }
  .profileExtra{
    text-align: end;
  }
  .deleteBtn{
    background-color: red;
    border: solid 1px black;
    border-radius: 30%;
    font-size: 15px;
    color: white;
    height: 20px;
    width: 20px;
    text-align:center;
  }
  .deleteBtn:hover{
    /* animation: 1s; */
    height: 50px;
    width: 50px;
    transform: rotate(360deg);
    transition: 1s;
    text-align:center;
  }
`

function App() {
  const [data , setData] = useState([])
  const [sendcontent , setSendConetent] = useState('')
  const [getcondition, setgetcontition] = useState(false)
  const [getdialog, setGetdialog] = useState(["어디야"]);
  const Hour = new Date().getHours()
  const minute = new Date().getMinutes()

  const messagesEndRef = useRef(null);


  // iu의 대화를 post하는 함수  
    const iu =  async (value) => {
          let reqPost = {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: shortid.generate(),
              img:  "https://mblogthumb-phinf.pstatic.net/MjAxODA2MDhfMTQz/MDAxNTI4NDU2MDU0OTAy.4n3m8GpSGAX-2O3arTUX0EkgrBtbhA40upI4_RAOBVog.wi0kXa2MYtqZQOvNft1AW_c-YWelsCsL_BwlvJKoe_Ag.JPEG.smotherguy/3.jpg?type=w2", 
              name: "이지은",
              content: value,
              createdAt: `${Hour}:${minute}`,
            }),
          }
          fetch('http://localhost:3001/chatting', reqPost)
          .then(res => res.json())
          setgetcontition(!getcondition)
        }
  
  let dialog = ["뭐해?" , "야", "전화", "받아라", "제발", "받아주라","뭐야 너..","???","ㅠㅠ","하.."];
  useEffect(() => {
    const rotateElements = async () => {
      let i = 0;
      async function SetIuDialog(arrayIndex){ await iu(arrayIndex) }; 

      while(i < dialog.length){
          setGetdialog( (prev) => {
            prev = dialog[i]
            console.log("prev : ", prev)
            return prev
          }); //아예 안들어가네 
            SetIuDialog(dialog[i])
            setgetcontition(!getcondition)
            i++
        console.log(dialog.length, dialog[i], getdialog)
      }
  }

  setTimeout(() => {
    rotateElements();
  },5000)
  
},[])

useEffect(()=>{
  messagesEndRef.current?.scrollIntoView();
}, [data])

  // 첫 랜더링 시 데이터를 get하고, getcondition이 바뀔 때마다 데이터를 get한다.
  useEffect( () => {
    const getAsync = async () => {
      fetch("http://localhost:3001/chatting/")
      .then(res => res.json())
      .then(res => setData(res))
    }
    getAsync()
  },[getcondition]);


  //전송버튼을 누르면 입력한 데이터가 post된다.
  const postChatData = (e) => {
    const Hour = new Date().getHours()
    const minute = new Date().getMinutes()

    let reqPost = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: shortid.generate(),
        name: "나",
        content: sendcontent,
        createdAt: `${Hour}:${minute}`,
      }),
    }
    fetch('http://localhost:3001/chatting', reqPost)
    .then(res => res.json())

    setgetcontition(!getcondition);
    setSendConetent('');
  } 


 

  const handleChangeContent = (e) => {
    setSendConetent(e.target.value)
  }

  //엔터키를 누르면 post실행
  const handleKeyPress = e => {
    if(e.key === 'Enter'){
      postChatData()
      e.target.value = null
    }
  }

  //전송버튼을 누르면 post 실행 
  const handleSumit = (e) => {
      e.preventDefault();
      postChatData()
      e.target.value = null
  }

  //삭제버튼 클릭시 map으로 랜더링시 지정한 id값을 받아 Delete요청 보냄
  const handleDelete = (idx) => {
    fetch('http://localhost:3001/chatting' + `/${idx}`, {
    method: 'DELETE',
  })
  .then(res => res.json()) // or res.json()
  .then(res => console.log(res))

  setgetcontition(!getcondition)
  } 
  
  return (
    <Style>
      <section className='chattingSection'>
        <article className='topbar'>
          KOKONUT Talk
        </article>
        <article className='mainarticle'>
        {data.map((el,idx) => {
          return(
            <>
            <div className = {el.name === "나" ? "chatsection2" :"chatsection"} id = "chatid" key = {idx}>
                <img className = {el.name === "나" ? null :"profileimg"} src = {el.img}></img>
                <div className = "profileMain">
                  <div className='chatname'> {el.name}</div>
                  <div className='contentbox'>
                    {/* <span className='arrow'>◀</span> */}
                    <div className='chatcontent'> {el.content}</div>
                  </div>
                  <div className='profileExtra'>
                    <span className='chattime'> {el.createdAt} </span>
                    <div className= 'deleteBtn' onClick={(e) => handleDelete(el.id)}>x</div>
                  </div>
                </div>
            </div>
            </>
          )
        })}
        <div ref = {messagesEndRef}/>
        </article>
        <article className='chatarticle'>
            <textarea 
              className = 'input' 
              placeholder="내용을 입력하세요." 
              onChange={e => handleChangeContent(e)}
              onKeyPress = {handleKeyPress}
              value={sendcontent}>
            </textarea>
            <button onClick = {e => handleSumit(e)} className='postBtn'>전송</button>
        </article>
      </section>
     <div>

    </div>
    </Style>
    
  )
}

export default App;
