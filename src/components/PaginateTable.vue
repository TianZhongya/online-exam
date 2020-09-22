<template>
  <div>
    <el-table :data="dataList" style="width: 100%">
      <slot></slot>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="pageChange"
      :total="pagination.rowCount"
      :current-page="pagination.pageNum"
      :page-size="pagination.perPage"
      :page-count="pagination.pageCount"
    >
    </el-pagination>
  </div>
</template>

<script>

export default {
  name: 'PaginateTable',
  props: {
    dataList: Array,
    pagination: Object,
    pageChange: Function
  }
}
</script>

<style scoped>

</style>
