import{a as u,at as s,j as i,aD as c,k as r}from"./index-CxEQY8K-.js";import{u as m}from"./useUnmount-BFNxcmtT.js";function p(t,n={}){const{preserveTitleOnUnmount:o=!0}=n,e=u.useRef(null);s(()=>{e.current=window.document.title},[]),s(()=>{window.document.title=t},[t]),m(()=>{!o&&e.current&&(window.document.title=e.current)})}const a=({title:t="",component:n=u.Fragment,children:o})=>{const e=n;return p(t+" - "+c),i.jsx(e,{children:o})};a.propTypes={children:r.node.isRequired,title:r.string,component:r.elementType};export{a as P};
