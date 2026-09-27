import {useState} from 'react';
export function useReservation(){const [selected,setSelected]=useState({date:'',time:'',party:2});const createReservation=()=>({id:Date.now(),...selected,status:'Pending'});const cancelReservation=id=>id;return{selected,setSelected,createReservation,cancelReservation}}
