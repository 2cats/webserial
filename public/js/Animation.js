import { zoomIn } from 'react-animations';
import { StyleSheet, css } from 'aphrodite';

const anim = StyleSheet.create({
  in:{
    animationName: zoomIn,
    animationDuration: '0.5s'
  }
})
export {anim as default}
