import './App.css';
import React, { useRef,useEffect } from 'react';
import { useRoutes } from "react-router-dom";
import routes from './router/index.jsx'
import { useNavigate } from 'react-router-dom';
const App = () => {
  const element = useRoutes(routes);
  const wrapRef = useRef();
  const navigate = useNavigate();
  //监听页面路由变化 移除滚动监听事件
  useEffect(() => {
    console.log('路由比那好',element);
    if(element.props.match.pathname!='/'){
      wrapRef.current.style.transform = 'scale(1)';
      wrapRef.current.removeEventListener('mousewheel',handleScroll)
    }
  },[element])

  const handleScroll = (e) => {
      if (e.deltaY > 0) {
        wrapRef.current.style.transform = 'scale(0.8)';
        if(e.deltaY>10){
          wrapRef.current.removeEventListener('mousewheel',handleScroll)
          //路由跳转到 /about
          navigate('/about');
        }
      }else{
        wrapRef.current.style.transform = 'scale(1.2)';
      }
  }
  useEffect(() => {
    if(element.props.match.pathname=='/'){
      wrapRef.current.addEventListener('mousewheel',handleScroll);
    }
    return () => {
      wrapRef.current.removeEventListener('mousewheel',handleScroll)
    }
  }, []);
  return (
    <div className="content" ref={wrapRef}>
      <>
        {element}
      </>
    </div>
  );
};

export default App;
