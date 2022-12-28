<template>
  <div>
    <UserList listType="1" />
  </div>
</template>

<script>
export default {
  name: 'CounselUser',
  components: {
    UserList: () => import('../components/UserList')
  }
}
</script>
