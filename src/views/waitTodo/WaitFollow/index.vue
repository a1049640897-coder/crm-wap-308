<template>
  <div>
    <UserList listType="8" />
  </div>
</template>

<script>
// εΎει
export default {
  name: 'WaitFollow',
  components: {
    UserList: () => import('@/views/consultation/components/UserList.vue')
  },
}
</script>
