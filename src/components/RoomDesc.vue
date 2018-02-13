
<script>
export default {
  data: function() {
    return {
      zomg: "ZOMG ROOM DESC HERE"
    }
  },
  props: {
    roomDesc: String
  },
  render: function(h) {
    console.log('this.roomDesc', this.roomDesc)
    const roomDescRawString = this.roomDesc

    const test = <div>{roomDescRawString}</div>
    return (
      test
    )
  }
}
</script>

<style scoped>

</style>



