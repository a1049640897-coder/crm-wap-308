<template>
  <div>
    <UserList listType="5" />
  </div>
</template>

<script>
// 待分配
export default {
  name: 'CounselDistribute',
  components: {
    UserList: () => import('../components/UserList')
  },
}
</script>
