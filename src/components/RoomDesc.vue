
<script>
export default {
  props: {
    roomDesc: String,
    roomExits: Array,
    sendTextToEvennia: Function
  },
  render: function(h) {
   const { roomDesc, roomExits } = this;
   const parsedRoom = roomDesc.split('*');

   const _createClickableExit = (exitName) => {
      return <span id="clickableRoomExit" on-click={ () => this.sendTextToEvennia(exitName)}>{exitName}</span> 
   }

  roomExits.forEach( name => {
    splitRoomByAsterix.forEach( (frag, idx, arr) => {
      if (name === frag) {
        arr[idx] = _createClickableExit(name)
      }
    } )
  })
    return <div>{splitRoomByAsterix}</div>
  }
};
</script>

<style scoped>
#clickableRoomExit {
  font-weight: bold;
}
</style>



