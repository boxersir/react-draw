import { Navigate  } from 'react-router-dom'
import { lazy } from 'react'
import Home from '../pages/home/index.jsx'
const About = lazy(()=>import('../pages/about/index.jsx'));
const Editor = lazy(()=>import('../pages/editor/index.jsx'));

const routes = [
    {
        path: "/",
        element: <Home />,
        children: [
            // 二级路由...
       ]
    },
    {
        path: "/about",
        element: <About />
    },
    {
        path: "/editor",
        element: <Editor />
    },
   // {
    //    path: "/my",
   //     element: <My />
   // },
    // 配置路由重定向 可配置404页面
    {
        path: '*',
        element: <Navigate to='/' />
    }
]

export default routes
