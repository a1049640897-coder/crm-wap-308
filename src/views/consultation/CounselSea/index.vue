<template>
  <div>
    <UserList listType="7" />
  </div>
</template>

<script>
// εΎει
export default {
  name: 'CounselSea',
  components: {
    UserList: () => import('../components/UserList')
  },
}
</script>
