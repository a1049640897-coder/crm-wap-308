<template>
  <div>
    <UserList listType="5" />
  </div>
</template>

<script>
// εΎει
export default {
  name: 'CounselDistribute',
  components: {
    UserList: () => import('../components/UserList')
  },
}
</script>
