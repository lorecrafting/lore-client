
<template>
    <div id="player_location_container">
      <header id="room_title_header">
        <h2>{{ roomTitle }}</h2>
      </header>

      <RoomDesc id="room_desc_container" 
        v-bind:roomExits="roomExits" 
        v-bind:roomDesc="roomDesc"
        v-bind:sendCommandToEvennia="sendCommandToEvennia" />

      <section id="room_contents_container">
          <p id="room_content_item" v-for="item in roomContents" :key="item">
            {{ item }}
          </p>
      </section>
      <!-- <section id="room_exits_container">
          <div v-if="roomExits.length > 0" id="room_exits_list">
            Exits:
          <span v-for="exit in roomExits" :key="exit">
            {{ exit }} ,
          </span>
          </div>
              </section> -->
      <section v-html="roomEventLog" id="room_events_container">
      </section>

      <section id="user_input_container">
        <form @submit.prevent="userInputSubmit">
          <input type="text" v-model="userInputTxt">
          <input @click="clearEventLog" type="button" value="clear">
        </form>
      </section>
      
    </div>
</template>

<script>
import RoomDesc from "./RoomDesc";

export default {
  name: "HelloWorld",
  data() {
    return {
      userInputTxt: null,
      roomEventLog: "",
      roomTitle: "",
      roomDesc: "",
      roomContents: [],
      roomExits: []
    };
  },
  created() {

      // Send heartbeat to keep Evennia conx alive
      setInterval( () => {
        console.log("Sending heartbeat to Evennia...")
        Evennia.msg("text", ["idle"], {});
      },
      60000*1
    );
    
  },
  mounted() {

    // TODO: Where to put and what to do with all these Evennia handlers?
    function onText(args, kwargs) {
      console.log("Evennit event: text", args, kwargs);
    }
    function onPrompt(args, kwargs) {
      console.log("Evennit event: prompt", args, kwargs);
    }
    function onDefault(cmdname, args, kwargs) {
      console.log("Evennit event: default", cmdname, args, kwargs);
    }
    function onConnectionClose(conn_name, evt) {
      console.log("Evennia event: connection_close", conn_name, evt);
    }
    function onLoggedIn() {
      console.log("Evennia event: logged_in");
    }
    function onGotOptions(args, kwargs) {
      console.log("Evennia event: webclient_options", args, kwargs);
    }
    // function onSilence(cmdname, kwargs, args) {
    //   console.log(
    //     "Evennia event: connection_open or connection_error",
    //     cmdname,
    //     kwargs,
    //     args
    //   );
    // }
    
    Evennia.emitter.on("prompt", onPrompt);
    Evennia.emitter.on("default", onDefault);
    Evennia.emitter.on("connection_close", onConnectionClose);
    Evennia.emitter.on("logged_in", onLoggedIn);
    Evennia.emitter.on("webclient_options", onGotOptions);
    // // silence currently unused events
    // Evennia.emitter.on("connection_open", onSilence);
    // Evennia.emitter.on("connection_error", onSilence);

    // handled events
    Evennia.emitter.on("text", this.onTextFromEvennia);
    Evennia.emitter.on("update_player_location", this.onUpdatePlayerLocation)
  },
  methods: {
    userInputSubmit: function() {
      const msg = this.userInputTxt;
      this.sendCommandToEvennia(msg);
    },
    sendCommandToEvennia: function(msg) {
      if (!Evennia.isConnected()) {
        const reconnect = confirm("Not currently connected. Reconnect?");
        if (reconnect) {
          this.onTextFromEvennia(["Attempting to reconnnect..."], { cls: "sys" });
          Evennia.connect();
        }
        // Don't try to send anything until the connection is back.
        return;
      }
      const outtext = msg
      const lines = outtext
        .trim()
        .replace(/[\r]+/, "\n")
        .replace(/[\n]+/, "\n")
        .split("\n");
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (line.length > 7 && line.substr(0, 7) == "##send ") {
          // send a specific oob instruction ["cmdname",[args],{kwargs}]
          line = line.slice(7);
          const cmdarr = JSON.parse(line);
          const cmdname = cmdarr[0];
          const args = cmdarr[1];
          const kwargs = cmdarr[2];
          log(cmdname, args, kwargs);
          console.log('Sending OOB command to Evennia: ', cmdname, args, kwargs)
          Evennia.msg(cmdname, args, kwargs);
        } else {
          // input_history.add(line);
          this.userInputTxt = "";
          console.log('Sending text to Evennia: ', line)
          Evennia.msg("text", [line], {});
        }
      }
    },
    onUpdatePlayerLocation: function(args, kwargs) {
      console.log("Evennia emits update_player_location:", args, kwargs );
      const currentLocation = kwargs;
      this.roomTitle = currentLocation.name;
      this.roomDesc = currentLocation.desc;
      this.roomContents = currentLocation.contents;
      this.roomExits = currentLocation.exits;
      this.clearEventLog();
    },
    onTextFromEvennia: function(args) {
      console.log("Evennia emits text: ", args)
      const data = args[0]
      this.roomEventLog += "<p>" + data + "</p>";

      // auto scroll to bottom of event log when appending message
      const container = this.$el.querySelector("#room_events_container");
      container.scrollTop = container.scrollHeight;
    },
    clearEventLog: function() {
      this.roomEventLog = "";
    }
  },
  components: {
    RoomDesc
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: bold;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
html {
  overflow: scroll;
  overflow-x: hidden;
  overflow-y: hidden;
}
::-webkit-scrollbar {
  width: 0px; /* remove scrollbar space */
  background: transparent; /* optional: just make scrollbar invisible */
}
/* optional: show position indicator in red */
::-webkit-scrollbar-thumb {
  background: #ffffff;
}
#player_location_container {
  width: 50%;
  margin: 0 auto;
  padding-left: 50px;
  padding-right: 50px;
}
#room_title_header {
  width: 650px;
  height: 50px;
}
#room_desc_container {
  padding-bottom: 20px;
  text-align: left;
  width: 650px;
  height: 100px;
}
#room_contents_container {
  width: 650px;
  padding-bottom: 20px;
  text-align: left;
}
#room_content_item {
  width: 100%;
}
#room_exits_container {
  width: 650px;
  text-align: center;
}
#room_events_container {
  width: 650px;
  height: 400px;
  padding-top: 30px;
  padding-bottom: 30px;
  text-align: left;
  overflow-y: hidden;
}
#user_input_container {
  width: 650px;
  padding-bottom: 20px;
  text-align: center;
}
.exitText {
  font-weight: bold;
}
</style>
