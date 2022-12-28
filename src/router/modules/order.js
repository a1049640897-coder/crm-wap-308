import layoutHome from '../../layout/index.vue'

const meta = { requiresAuth: true }

export default {
  path: '/order',
  name: 'Order',
  meta,
  redirect: { name: 'order' },
  component: layoutHome,
  children: (pre => [
    {
      path: '/updateCollectionRecord/:orderId/:collectionId', name: `${pre}updateCollectionRecord`, component: () => import('@/views/orderManage/CollectionRecord'), meta: { meta, cache: false, title: '添加收款记录', isCloseWorkOrder: true }, beforeEnter: (to, from, next) => {
        const { collectionId } = to.params
        if (collectionId !== 'null') {
          to.meta.title = '编辑收款记录'
        } else {
          to.meta.title = '添加收款记录'
        }
        next()
      }
    },
    {
      path: '/lookPayRecord/:id', name: `${pre}lookPayRecord`, component: () => import('@/views/orderManage/LookPayRecord'), meta: { meta, cache: true, title: '查看支付记录', isCloseWorkOrder: true }
    },
    {
      path: '/payRecordEdit/:id', name: `${pre}payRecordEdit`, component: () => import('@/views/orderManage/PayRecotdEdit'), meta: { meta, cache: false, title: '编辑支付记录', isCloseWorkOrder: true }
    },
    {
      path: '/electronicReceipt/:orderId/:branchId/:recordId', name: `${pre}electronicReceipt`, component: () => import('@/views/orderManage/ElectronicReceipt'), meta: { meta, cache: false, title: '电子收据', isCloseWorkOrder: true }
    },
    // },
  ])('order-')
}
