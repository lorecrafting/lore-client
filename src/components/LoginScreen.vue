<template>
<div>
  <h2>ZOMG LOGIN SCREEN HERE</h2>
  <p>Just enter a name, any name, no need for password</p>
  
  <form @submit.prevent="loginWithUsername">
    <input type="text" v-model="username">
    <input type="submit" value="Enter">
  </form>
</div>
</template>

<script>
export default {
    name: 'LoginScreen',
    data() {
      return {
        username: null
      }
    },
    methods: {
      loginWithUsername: function() {
        // HACKY: This will try to create a new user no matter what with
        // default password of 1234 and log in after a settimeout
        // no guards or checks or error handling
        console.log('zomg logging in with', this.username);

        const createUserMsg = "create " + this.username + " 1234";
        Evennia.msg("text", [createUserMsg], {});

        const loginUserMsg = "connect " + this.username + " 1234";
        Evennia.msg("text", [loginUserMsg], {});
        setTimeout( () => {
          this.$router.push("/main")
        },500)
      }
    }
}
</script>
