<template>
  <!-- 换班记录 -->
  <div>
    <UserList listType="ShiftRecord" ref="userList"/>
  </div>
</template>

<script>
export default {
  name: 'ShiftRecord',
  components: {
    UserList: () => import('./components/UserList')
  }
}
</script>
