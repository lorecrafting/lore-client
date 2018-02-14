
<script>
export default {
  props: {
    roomDesc: {
      default: "",
      type: String
    },
    roomExits: {
      default: [],
      type: Array 
    },
    sendTextToEvennia: Function
  },
  render: function(h) {
   const { roomDesc, roomExits } = this;
   const parsedRoom = roomDesc.split('*');

   const _createClickableExit = (exitName) => {
      return <span id="clickableRoomExit" on-click={ () => this.sendTextToEvennia(exitName)}>{exitName}</span> 
   }
  roomExits.forEach( name => {
    parsedRoom.forEach( (frag, idx, arr) => {
      if (name === frag) {
        arr[idx] = _createClickableExit(name)
      }
    } )
  })
    return <div>{parsedRoom}</div>
  }
};
</script>

<style scoped>
#clickableRoomExit {
  font-weight: bold;
}
</style>



