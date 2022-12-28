<template>
  <!-- 报名收款 -->
  <div>
    <UserList listType="EnrollmentCollection" ref="userList" />
  </div>
</template>

<script>
export default {
  name: 'EnrollmentCollection',
  components: {
    UserList: () => import('./components/UserList')
  }
}
</script>
