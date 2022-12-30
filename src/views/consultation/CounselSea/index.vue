<template>
  <div>
    <UserList listType="7" />
  </div>
</template>

<script>
// 待分配
export default {
  name: 'CounselSea',
  components: {
    UserList: () => import('../components/UserList')
  },
}
</script>
