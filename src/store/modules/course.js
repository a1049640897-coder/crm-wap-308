

export default {
  namespaced: true,
  state: {
    isAddUpdate: false, // 课程包添加是否刷新
    courseId: null, // 课程包id 用来刷新列表,
    addUpdateId: null, // 添加课程包刷新列表
  },
  mutations: {
    SET_UPDATEFLAG(state, payload) {
      const { isAddUpdate, addUpdateId } = payload
      state.isAddUpdate = isAddUpdate
      state.addUpdateId = addUpdateId
    },
    SET_COURSEID(state, payload) {
      const { courseId } = payload
      state.courseId = courseId
    }

  },
  actions: {}
}