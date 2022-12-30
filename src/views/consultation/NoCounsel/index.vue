<template>
  <div>
    <UserList listType="4" />
  </div>
</template>

<script>
// 未咨询
export default {
  name: 'NoCounsel',
  components: {
    UserList: () => import('../components/UserList')
  },
  data() {
    return {

    }
  },
  created() {
  },
  methods: {

  }
}
</script>
