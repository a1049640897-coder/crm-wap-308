import layoutHome from '../../layout/index.vue'
const meta = { requiresAuth: true }

export default {
  path: '/courseManage',
  name: 'courseManage',
  component: layoutHome,
  redirect: { name: 'courseManage' },
  meta,
  children: (pre => [
    {
      path: '/courseManage',
      name: `${pre}index`,
      component: () => import('@/views/courseManage/index'),
      meta: { cache: true, title: '课程包收款' }
    },
    { path: '/courseDetail/:id', name: `${pre}courseDetail`, component: () => import('@/views/courseManage/courseDetail/index'), meta: { cache: false, title: '课程包收款详情' } },
    { path: '/courseAddEdit/:id/:cooperationType', name: `${pre}courseAddEdit`, component: () => import('@/views/courseManage/CourseAddEdit/index'), meta: { cache: false, title: '课程包添加', isCloseWorkOrder: true } },
  ])('courseManage-')
}