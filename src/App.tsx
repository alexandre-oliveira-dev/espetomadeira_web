import { BrowserRouter } from 'react-router-dom'
import './App.css'
import RouterApp from './routes/router'
import { Layout } from 'antd'
import { Content } from 'antd/es/layout/layout'
import NavBar from './components/navBar/navbar'

function App() {

  return (
    <>
      <BrowserRouter>
             <Layout style={{flexDirection:'row'}}>
         <Content
          style={{
            width: 'calc(100vw - 230px)',
            minHeight: 'calc(100vh - 60px)',
            padding: '0 20px 50px 20px',
            position: 'relative',
            marginLeft: '200px',
            marginTop: '60px',
          }}
          >
            <NavBar></NavBar>
            <div style={{
          marginLeft:'200px'
        }}><RouterApp></RouterApp></div>
        </Content>
            </Layout>
      </BrowserRouter>
    </>
  )
}

export default App
