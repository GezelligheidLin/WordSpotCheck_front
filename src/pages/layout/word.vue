<!--主页---单词页-->
<template>
  <!--单词表格-->
  <div style="float: right">
    <el-table v-loading="loading" size="large" border :data="tableData" style="width: 680px" max-height="88vh" @selection-change="getTheSelectedWordIds">
      <el-table-column fixed type="selection" width="55" align="center" header-align="center" />
      <el-table-column align="center" header-align="center" prop="word" label="单词" width="180" />
      <el-table-column align="center" :sortable="true" :sort-method="PageSort" header-align="center" prop="page" label="页数" width="90" />
      <el-table-column align="center" :sortable="true" :sort-method="trueCountSort" header-align="center" prop="trueCount" label="正确次数" width="117" />
      <el-table-column align="center" :sortable="true" :sort-method="errorCountSort" header-align="center" prop="errorCount" label="错误次数" width="117" />
      <el-table-column align="center" header-align="center" fixed="right" label="Operations" width="120">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="modifyWordTrue(scope.row)"
          >True</el-button
          >
          <el-button link type="primary" size="small" @click="modifyWordError(scope.row)"
          >False</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!--单词批量修改工作栏-->
  <div style="height: 100%;width: 60px;float: right;margin-right: 5px">
    <div style="text-align: center;margin-top: 50px;">
      <el-tooltip
          class="box-item"
          effect="dark"
          content="正确"
          placement="left-start"
      >
        <el-button @click="modifyWordTrueByIds"><el-icon size="25px"><Select /></el-icon></el-button>
      </el-tooltip>
    </div>
    <div style="text-align: center;margin-top: 50px;">
      <el-tooltip
          class="box-item"
          effect="dark"
          content="错误"
          placement="left-start"
      >
        <el-button @click="modifyWordErrorByIds"><el-icon size="25px"><CloseBold /></el-icon></el-button>
      </el-tooltip>
    </div>
    <div style="text-align: center;margin-top: 50px;">
      <el-tooltip
          class="box-item"
          effect="dark"
          content="未抽查的单词"
          placement="left-start"
      >
        <el-button><el-icon size="25px"><ZoomOut /></el-icon></el-button>
      </el-tooltip>
    </div>
    <div style="text-align: center;margin-top: 50px;">
      <el-tooltip
          class="box-item"
          effect="dark"
          content="正确的单词"
          placement="left-start"
      >
        <el-button><el-icon size="25px"><Sunrise /></el-icon></el-button>
      </el-tooltip>
    </div>
    <div style="text-align: center;margin-top: 50px;">
      <el-tooltip
          class="box-item"
          effect="dark"
          content="错误的单词"
          placement="left-start"
      >
        <el-button><el-icon size="25px"><MostlyCloudy /></el-icon></el-button>
      </el-tooltip>
    </div>
    <div style="text-align: center;margin-top: 50px;">
      <el-tooltip
          class="box-item"
          effect="dark"
          content="完全领悟的单词"
          placement="left-start"
      >
        <el-button><el-icon size="25px"><Sunny /></el-icon></el-button>
      </el-tooltip>
    </div>
    <div style="text-align: center;margin-top: 50px;">
      <el-tooltip
          class="box-item"
          effect="dark"
          content="难记的单词"
          placement="left-start"
      >
        <el-button><el-icon size="25px"><Drizzling /></el-icon></el-button>
      </el-tooltip>
    </div>
    <div style="text-align: center;margin-top: 50px;">
      <el-tooltip
          class="box-item"
          effect="dark"
          content="重置"
          placement="left-start"
      >
        <el-button @click="reset"><el-icon size="25px"><Clock /></el-icon></el-button>
      </el-tooltip>
    </div>
  </div>

  <!--抽查单词模块-->
  <div style="margin-left: 180px;margin-top: 90px">
    <span style="font-family: 华文彩云,serif;font-size: 20px">抽查范围设置</span>
    <el-switch
        v-model="switchValue"
        class="mt-2"
        style="margin-left: 5px"
        inline-prompt
        :active-icon="Check"
        :inactive-icon="Close"
    />
    <el-table empty-text="请先设置单词范围~" border :data="spotCheckData" style="width: 660px">
      <el-table-column align="center" header-align="center" label="单词" width="180">
        <template #default="scope">
          <div style="">
          <div style="font-size: 20px;font-weight: 700;margin-top: 10px;margin-bottom: 10px">{{scope.row.word}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" prop="page" label="页数" width="120" />
      <el-table-column align="center" header-align="center" prop="trueCount" label="正确次数" width="120" />
      <el-table-column align="center" header-align="center" prop="errorCount" label="错误次数" width="120" />
      <el-table-column fixed="right" align="center" header-align="center" label="Operations" width="120">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="randomlyCheckWordsToTrue(scope.row)"
          >True</el-button
          >
          <el-button link type="primary" size="small" @click="randomlyCheckWordsToError(scope.row)"
          >False
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- 抽查单词范围设置模块 -->
  <div v-if="switchValue" style="width: 550px;height: 250px;margin-top: 250px;margin-left: 250px;border:1px solid #ebeef5;text-align: center">
    <div style="font-family: 华文彩云,serif;font-size: 30px;margin-top: 20px">抽查范围设置</div>
    <el-slider v-model="NoOne" show-input style="width: 450px;margin: auto;margin-top: 30px" :max="tableData.length"/>
    <el-slider v-model="NoTwo" show-input style="width: 450px;margin: auto;margin-top: 40px" :max="tableData.length"/>
    <el-button round style="margin-top: 20px;margin-left: 100px" @click="randomlyCheckWords">
      <el-icon size="20px" style="margin-right: 10px"><Watermelon /></el-icon>
      OK!
    </el-button>
    <el-button round style="float: right;margin-top: 20px;margin-right: 10px" @click="ResetSlider">
      <el-icon size="20px" style="margin-right: 10px"><IceCreamRound /></el-icon>
      Reset!
    </el-button>
  </div>
</template>

<script setup lang="ts">
/*引入Vue3依赖*/
import {getCurrentInstance, reactive, ref, watch} from "vue";
import {ElMessage} from "element-plus";
import { Check, Close } from '@element-plus/icons-vue'
/*调用axios*/
const currentInstance = getCurrentInstance()
const {$http}: any = currentInstance?.appContext.config.globalProperties

/*
* describe: 创建switch开关判断标识
* */
const switchValue = ref(true);

/*
* describe: 创建加载判断标识
* */
const loading = ref(true);

/*
* describe: 创建抽查范围第一个参数
* */
const NoOne = ref(0);

/*
* describe: 创建抽查范围第二个参数
* */
const NoTwo = ref(0);

/*
* describe: 创建word对象
* Properties:
*   id:单词id
*   word---单词,
*   page---页数,
*   errorCount---错误次数
* */
interface word {
  id: number
  word: string
  page: number
  errorCount: number
}

/*
* describe: 创建wordIds数组,用于存入所有单词的id
* */
const wordIds:number[] = reactive([])

/*
* describe: 创建word对象数组,用于存入所有单词的数据
* */
const tableData: word[] = reactive([
  {
    id:0,
    word:'',
    page:0,
    errorCount:0,
    trueCount:0,
  }
])

/*
* describe: 创建word对象数组,用于存入抽查单词的数据
* */
const spotCheckData: word[] = reactive([

])

/*
* Function description: 获取单词表中选中单词的id
* Function return value type: void
* Whether to call automatically: false
* */
const getTheSelectedWordIds = (words:word[]) =>{
  wordIds.length=0;
  words.forEach((i:any) => wordIds.push(i.id));
  console.log(wordIds)
}

/*
* Function description: word数据根据页数排序
* Function return value type: number
* Whether to call automatically: false
* */
const PageSort = (a:word,b:word) => {
  return a.page-b.page;
}

/*
* Function description: 重置抽查单词设置的范围
* Function return value type: void
* Whether to call automatically: false
* */
const ResetSlider = () => {
  NoOne.value = 0;
  NoTwo.value = 0;
  spotCheckData.length=0;
}

/*
* Function description: word数据根据错误次数排序
* Function return value type: number
* Whether to call automatically: false
* */
const errorCountSort = (a:any,b:any) => {
  return a.errorCount-b.errorCount;
}

/*
* Function description: word数据根据正确次数排序
* Function return value type: number
* Whether to call automatically: false
* */
const trueCountSort = (a:any,b:any) => {
  return a.trueCount-b.trueCount;
}

/*
* Function description: 修改随机抽查的单词为正确
* Function return value type: void
* Whether to call automatically: false
* */
const randomlyCheckWordsToTrue = (row:any) => {
  modifyWordTrue(row);
  randomlyCheckWords();
}

/*
* Function description: 修改随机抽查的单词为错误
* Function return value type: void
* Whether to call automatically: false
* */
const randomlyCheckWordsToError = (row:any) => {
  modifyWordError(row);
  randomlyCheckWords();
}

/*
* Function description: randomlyCheckWords的工具函数
* Function return value type: void
* Whether to call automatically: false
* */
const randomlyCheckWordsUtil = (NoOne:number,NoTwo:number) => {
  $http.get("http://localhost:8081/word/WordNotCheckedId/" + NoOne + "," + NoTwo).then((res:any) => {
    spotCheckData.length=0;
    spotCheckData.push(res.data.data);
  })
}

/*
* Function description: 利用axios获取随机单词数据
* Function return value type: void
* axios:
*   type: post
*   port: http://localhost:8081/word/WordNotCheckedId/
*   Value passed to backend: NoOne,NoTwo
*   then(res): 获取res中携带的修改信息使用弹窗显示出来
* Whether to call automatically: false
* */
const randomlyCheckWords = () => {
  if(NoOne.value > NoTwo.value && (NoOne.value !== 0 && NoTwo.value !== 0)){
    ElMessage({
      message: '第一个参数的值不能大于第二参数的值',
      grouping: true,
      type: 'warning',
    })
  }else {
    if (NoOne.value === 0 && NoTwo.value !== 0) {
      NoOne.value = 1;
      randomlyCheckWordsUtil(NoOne.value, NoTwo.value);
    } else if (NoTwo.value === 0 && NoOne.value !== 0) {
      NoTwo.value = tableData.length;
      randomlyCheckWordsUtil(NoOne.value, NoTwo.value);
    } else if (NoOne.value !== 0 && NoTwo.value !== 0) {
      randomlyCheckWordsUtil(NoOne.value, NoTwo.value);
    } else {
      ElMessage({
        message: '请先设置范围',
        grouping: true,
        type: 'error',
      })
    }
  }
}

/*
* Function description: 利用axios使单词批量变为正确单词
* Function return value type: void
* axios:
*   type: post
*   port: http://localhost:8081/word/modifyWordTrueByIds
*   Value passed to backend: wordIds
*   then(res): 获取res中携带的修改信息使用弹窗显示出来
* Whether to call automatically: false
* */
const modifyWordTrueByIds = () => {
  $http.post("http://localhost:8081/word/modifyWordTrueByIds",wordIds).then((res:any) => {
    if(res.data.success === true){
      ElMessage({
        message: res.data.data,
        grouping: true,
        type: 'success',
      })
      showWord();
    }else{
      ElMessage({
        message: res.data.errorMsg,
        grouping: true,
        type: 'warning',
      })
    }
  })
}

/*
* Function description: 利用axios使单词批量变为错误单词
* Function return value type: void
* axios:
*   type: post
*   port: http://localhost:8081/word/modifyWordErrorByIds
*   Value passed to backend: wordIds
*   then(res): 获取res中携带的修改信息使用弹窗显示出来
* Whether to call automatically: false
* */
const modifyWordErrorByIds = () => {
  $http.post("http://localhost:8081/word/modifyWordErrorByIds",wordIds).then((res:any) => {
    if(res.data.success === true){
      ElMessage({
        message: res.data.data,
        grouping: true,
        type: 'success',
      })
      showWord();
    }else{
      ElMessage({
        message: res.data.errorMsg,
        grouping: true,
        type: 'warning',
      })
    }
  })
}

/*
* Function description: 利用axios使单词变为正确单词
* Function return value type: void
* axios:
*   type: post
*   port: http://localhost:8081/word/modifyWordTrue
*   Value passed to backend: tableData/spotCheckData
*   then(res): 获取res中携带的修改信息使用弹窗显示出来
* Whether to call automatically: false
* */
const modifyWordTrue = (row:any) => {
  $http.post("http://localhost:8081/word/modifyWordTrue",row).then((res:any) => {
    if(res.data.success === true){
      ElMessage({
        message: res.data.data,
        grouping: true,
        type: 'success',
      })
      showWord();
    }else{
      ElMessage({
        message: res.data.errorMsg,
        grouping: true,
        type: 'warning',
      })
    }
  })
}

/*
* Function description: 利用axios使单词变为错误单词
* Function return value type: void
* axios:
*   type: post
*   port: http://localhost:8081/word/modifyWordError
*   Value passed to backend: tableData/spotCheckData
*   then(res): 获取res中携带的修改信息使用弹窗显示出来
* Whether to call automatically: false
* */
const modifyWordError = (row:any) => {
  $http.post("http://localhost:8081/word/modifyWordError",row).then((res:any) => {
    if(res.data.success === true){
      ElMessage({
        message: res.data.data,
        grouping: true,
        type: 'success',
      })
      showWord();
    }else{
      ElMessage({
        message: res.data.errorMsg,
        grouping: true,
        type: 'warning',
      })
    }
  })
}

/*
* Function description: 利用axios重置单词数据
* Function return value type: void
* axios:
*   type: put
*   port: http://localhost:8081/word/Reset
*   Value passed to backend: nothing
*   then(res): 获取res中携带的修改信息使用弹窗显示出来
* Whether to call automatically: false
* */
const reset = () => {
  $http.put("http://localhost:8081/word/Reset").then((res:any) => {
    if(res.data.success === true){
      ElMessage({
        message: res.data.data,
        grouping: true,
        type: 'success',
      })
      showWord();
    }else{
      ElMessage({
        message: res.data.errorMsg,
        grouping: true,
        type: 'error',
      })
    }
  })
}

/*
* Function description: 利用axios获取后端返回的数据并给word数组赋值
* Function return value type: void
* axios:
*   type: get
*   port: http://localhost:8081/word/showWord
*   Value passed to backend: nothing
*   then(res): 获取res中data里的值赋值给tableData
* Whether to call automatically: True
* */
const showWord = () => {
  $http.get("http://localhost:8081/word/showWord").then((res:any) => {
    if (res.data.success === true) {
      tableData.length = 0;
      res.data.data.forEach((i: word) => tableData.push(i));
      loading.value = false;
    }else{
      console.log(res.data.errorMsg)
    }
  })
}
showWord();

</script>

<style scoped>

</style>