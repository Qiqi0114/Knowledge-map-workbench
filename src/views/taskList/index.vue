<template>
  <div class="undone" style="margin: 30px">
    <div style="font-weight: 600; color: #ccc; margin: 10px">
      未完成任务列表
    </div>
    <el-table
      :data="tableUndoneData"
      border
      style="width: 100%"
      :height="200"
      v-loading="undoneLoading"
    > 
      <el-table-column
        prop="id"
        label="id"
        width="100"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="bookName"
        label="书籍名称"
        width="180"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="directoryName"
        label="章节名称"
        width="180"
        :show-overflow-tooltip="true"
      />
      <el-table-column prop="userName" label="用户名" width="120" />
      <el-table-column
        prop="taskCreateTime"
        label="创建时间"
        width="180"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="taskLoadTime"
        label="截止时间"
        width="180"
        :show-overflow-tooltip="true"
      />
      <el-table-column prop="staticZ" fixed="right" label="操作">
        <template #default="scope">
          <el-button type="primary" link @click="applyForExtension(scope.row)"
            >申请任务延期</el-button
          >
          <el-button type="danger" link @click="endTask(scope.row)"
            >结束任务</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--分页器 start-->
    <div class="pagination-bg">
      <el-pagination
        v-model:currentPage="CurrentPage"
        v-model:page-size="PageSize"
        :page-sizes="[10, 20]"
        :small="Small"
        :disabled="Disabled"
        :background="Background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="Total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!--分页器 end-->
  </div>
  <div class="done" style="margin: 80px 30px 30px 30px">
    <div style="font-weight: 600; color: #ccc; margin: 10px">
      已完成任务列表
    </div>
    <el-table
      :data="tabledoneData"
      border
      style="width: 100%"
      :height="200"
      v-loading="doneLoading"
    >
      <el-table-column
        prop="id"
        label="id"
        width="100"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="bookName"
        label="书籍名称"
        width="180"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="directoryName"
        label="章节名称"
        width="180"
        :show-overflow-tooltip="true"
      />
      <el-table-column prop="userName" label="用户名" width="120" />
      <el-table-column
        prop="taskCreateTime"
        label="创建时间"
        width="180"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="taskLoadTime"
        label="截止时间"
        width="180"
        :show-overflow-tooltip="true"
      />
      <el-table-column prop="staticZ" fixed="right" label="操作">
        <template #default="scope">
          <el-button type="danger" link @click="taskRollback(scope.row)"
            >任务回退</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--分页器 start-->
    <div class="pagination-bg">
      <el-pagination
        v-model:currentPage="pCurrentPage"
        v-model:page-size="pPageSize"
        :page-sizes="[10, 20]"
        :small="pSmall"
        :disabled="pDisabled"
        :background="pBackground"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pTotal"
        @size-change="phandleSizeChange"
        @current-change="phandleCurrentChange"
      />
    </div>
    <!--分页器 end-->
  </div>
  <el-dialog v-model="dialogFormVisible" title="申请任务延期">
    <el-form>
      <el-form-item label="截至时间">
        <el-date-picker
          v-model="dataValue"
          type="datetime"
          format="YYYY/MM/DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="选择截至时间"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmApplyForExtension()">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted, ref } from "vue";
import { endTaskAPI, extensionAPI, getNewTaskListAPI, rollbackTaskAPI } from "../../api/visualization";
const undoneLoading = ref<boolean>(false);
const doneLoading = ref<boolean>(false);
// 总数
const Total = ref(0);
// 第几页
const CurrentPage = ref<number>(1);
// 每页多少条
const PageSize = ref<number>(10);
const Small = ref(false);
const Disabled = ref(false);
const Background = ref(false);
const phandleSizeChange = (val: number) => {
  PageSize.value = val;
  getUndoneTaskList();
};
const phandleCurrentChange = (val: number) => {
  CurrentPage.value = val;
  getUndoneTaskList();
};
// 总数
const pTotal = ref(0);
// 第几页
const pCurrentPage = ref<number>(1);
// 每页多少条
const pPageSize = ref<number>(10);
const pSmall = ref(false);
const pDisabled = ref(false);
const pBackground = ref(false);
const handleSizeChange = (val: number) => {
  pPageSize.value = val;
  getdoneTaskList();
};
const handleCurrentChange = (val: number) => {
  pCurrentPage.value = val;
  getdoneTaskList();
};
//表格数据
const tableUndoneData = ref([]);
//获取未完成任务列表
const getUndoneTaskList = async () => {
  try {
    undoneLoading.value = true;
    tableUndoneData.value = [];
    const res = await getNewTaskListAPI({type:'1'});
    if (res.data.code === 200) {
      tableUndoneData.value = res.data.data.records; 
      Total.value = res.data.data.total;
      PageSize.value = res.data.data.size;
      CurrentPage.value = res.data.data.pages;
    } else {
    }
    undoneLoading.value = false;
  } catch (e) {}
};
//表格数据
const tabledoneData = ref([]);
//获取已完成任务列表
const getdoneTaskList = async () => {
  try {
    doneLoading.value = true;
    tabledoneData.value = [];
    const res = await getNewTaskListAPI({type:'2'});
    if (res.data.code === 200) {
      tabledoneData.value = res.data.data.records; 
      pTotal.value = res.data.data.total;
      pPageSize.value = res.data.data.size;
      pCurrentPage.value = res.data.data.pages;
    } else {
    }
    doneLoading.value = false;
  } catch (e) {}
};
//结束任务
const endTask = async (row: any) => {
  ElMessageBox.confirm("确认结束任务?", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "warning",
  })
    .then(async () => {
      //结束过渡效果
      undoneLoading.value = true;
      const res = await endTaskAPI({id:row.id});
      if (res.data.code == 200) {
          ElMessage({
              message: "已结束",
              duration: 1500,
              type: "success",
          });
          getUndoneTaskList();
      } else {
          ElMessage.error(res.data.msg)
      } 
      undoneLoading.value = false;
    })
    .catch(() => {
      console.log("error");
    });
};
//任务延期对话框
const dialogFormVisible = ref<boolean>(false);
//延期时间
const dataValue = ref();
//延期任务id
const extensionBookId =ref<string>();
//任务延期
const applyForExtension = async (row: any) => {
    dialogFormVisible.value = true;
    extensionBookId.value = row.id;
};
//确认延期
const confirmApplyForExtension = async() => {
    try{
        undoneLoading.value = true;
        const res = await extensionAPI({
            id:extensionBookId.value,
            data:dataValue.value,
        })
        if (res.data.code == 200) {
          ElMessage({
              message: "延期成功",
              duration: 1500,
              type: "success",
          });
          getUndoneTaskList();
          extensionBookId.value = '';
          dataValue.value = '';
          dialogFormVisible.value = false;
        } else {
            ElMessage.error(res.data.msg)
        } 
        undoneLoading.value = false;
    }catch(e){console.log('e',e);}
}
//任务回退
const taskRollback = async (row: any) => {
  ElMessageBox.confirm("确认任务回退?", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "warning",
  })
    .then(async () => {
      //回退的过渡效果
      doneLoading.value = true;
    const res = await rollbackTaskAPI({id:row.id});
      if (res.data.code == 200) {
          ElMessage({
              message: "已回退",
              duration: 1500,
              type: "success",
          });
          getdoneTaskList();
      } else {
          ElMessage.error(res.data.msg)
      } 
      doneLoading.value = false;
    })
    .catch(() => {
      console.log("error");
    });
};
onMounted(() => {
  getUndoneTaskList();
  getdoneTaskList();
});
</script>

<style lang="scss" scoped>
.pagination-bg {
  float: right;
  padding: 20px;
}
</style>