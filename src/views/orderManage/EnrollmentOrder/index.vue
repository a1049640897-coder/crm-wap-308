<template>
  <!-- 报名订单 -->
  <div>
    <UserList listType="EnrollmentOrder" ref="userList" />
  </div>
</template>

<script>
export default {
  name: 'EnrollmentOrder',
  components: {
    UserList: () => import('./components/UserList')
  }
}
</script>
