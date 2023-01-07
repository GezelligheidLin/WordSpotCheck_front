<!--主页---单词页-->
<template>
  <!--单词表格-->
  <div style="float: right">
    <el-table :empty-text="TableNoDataValue" v-loading="loading" size="large" border :data="tableData" style="width: 680px" max-height="88vh" @selection-change="getTheSelectedWordIds">
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
        <el-button @click="wordsNotSelected"><el-icon size="25px"><ZoomOut /></el-icon></el-button>
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
  <div v-if="backAllWord" style="height: 100%;width: 60px;float: right;margin-right: 5px">
    <div style="text-align: center;margin-top: 50px;">
      <el-tooltip
          class="box-item"
          effect="dark"
          content="返回所有单词"
          placement="left-start"
      >
        <el-button @click="()=>{showWord().then(()=>{backAllWord = false;TASKBAR_POINTER = ''})}"><el-icon size="25px"><ZoomIn /></el-icon></el-button>
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
    <el-table :empty-text="spotCheckTableNoDataValue" border :data="spotCheckData" style="width: 660px">
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
    <el-slider v-model="NoOne" show-input style="width: 450px;margin: auto;margin-top: 30px" :max="maxLength"/>
    <el-slider v-model="NoTwo" show-input style="width: 450px;margin: auto;margin-top: 40px" :max="maxLength"/>
    <el-button round style="margin-top: 20px;margin-left: 100px" @click="randomlyCheckWords">
      <el-icon size="20px" style="margin-right: 10px"><Watermelon /></el-icon>
      OK!
    </el-button>
    <el-button round style="float: right;margin-top: 20px;margin-right: 10px" @click="ResetSlider">
      <el-icon size="20px" style="margin-right: 10px"><IceCreamRound /></el-icon>
      Reset!
    </el-button>
  </div>

  <div v-if="!switchValue" class="card" style="float: left;margin-top: 190px;margin-left: 390px;">
    <div class="card-border-top">
    </div>
    <el-image class="img" src="https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/14753/tired.jpg" />
    <span> LinTongXue</span>
    <p class="job">You are enviable <br/>for your hard work</p>
    <button> Click
    </button>
  </div>
</template>

<script setup lang="ts">
/*引入Vue3依赖*/
import {getCurrentInstance, reactive, ref, watch} from "vue";
import {ElMessage} from "element-plus";
import {Check, Close, Timer} from '@element-plus/icons-vue'
/*调用axios*/
const currentInstance = getCurrentInstance()
const {$http}: any = currentInstance?.appContext.config.globalProperties

/*
* describe: 创建范围设置的最大值
* */
let maxLength;

/*
* describe: 创建是否返回所有单词列表判别标识
* */
const backAllWord = ref(false)

/*
* describe: 创建工作栏列表各属性对应的名称列表
* */
const taskbar:string[] = ['UnselectedWords','CorrectWords','ErrorWords','FullyMasteredWords','HardToRememberWords'];

/*
* describe: 创建当前任务栏对象指针
*   UnselectedWords：未被抽查的单词
*   CorrectWords：正确的单词
*   ErrorWords：错误的单词
*   FullyMasteredWords：完全掌握的单词
*   HardToRememberWords：难记的单词
* */
const TASKBAR_POINTER = ref('')

/*
* describe: 创建随机抽查单词没有数据时的提示语
* */
const spotCheckTableNoDataValue = ref("请先设置单词范围~");

/*
* describe: 创建单词列表没有数据时的提示语
* */
const TableNoDataValue = ref("没有单词数据");

/*
* describe: 创建switch开关判断标识
* */
const switchValue = ref(false);

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
* Function description: 睡眠函数
* Function return value type: Promise<void>
* Whether to call automatically: false
* */
const sleep = (millisecond:number) => {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve()
    }, millisecond)
  })
}

/*
* Function description: 获取单词表中选中单词的id
* Function return value type: void
* Whether to call automatically: false
* */
const getTheSelectedWordIds = (words:word[]) =>{
  wordIds.length=0;
  words.forEach((i:any) => wordIds.push(i.id));
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
  spotCheckTableNoDataValue.value = "请先设置单词范围~"
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
const randomlyCheckWordsToTrue = (row: any) => {
  modifyWordTrue(row).then((v:any)=>{
    randomlyCheckWords();
  });
}

/*
* Function description: 修改随机抽查的单词为错误
* Function return value type: void
* Whether to call automatically: false
* */
const randomlyCheckWordsToError = (row:any) => {
  modifyWordError(row).then((v:any)=>{
    randomlyCheckWords();
  });

}

/*
* Function description: randomlyCheckWords的工具函数
* Function return value type: void
* Whether to call automatically: false
* */
const randomlyCheckWordsUtil = async (NoOne:number,NoTwo:number) => {
  await $http.get("http://localhost:8081/word/spotCheckWord/" + NoOne + "," + NoTwo).then((res:any) => {
    if(res.data.success == true) {
      spotCheckData.length = 0;
      spotCheckData.push(res.data.data);
    }else{
      spotCheckData.length = 0;
      spotCheckTableNoDataValue.value = res.data.errorMsg;
      ElMessage({
        message: res.data.errorMsg,
        grouping: true,
        type: 'warning',
      })
    }
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
const randomlyCheckWords = async () => {
  if(NoOne.value > NoTwo.value && (NoOne.value !== 0 && NoTwo.value !== 0)){
    ElMessage({
      message: '第一个参数的值不能大于第二参数的值',
      grouping: true,
      type: 'warning',
    })
  }else {
    if (NoOne.value === 0 && NoTwo.value !== 0) {
      NoOne.value = 1;
      await randomlyCheckWordsUtil(NoOne.value, NoTwo.value);
    } else if (NoTwo.value === 0 && NoOne.value !== 0) {
      NoTwo.value = tableData.length;
      await randomlyCheckWordsUtil(NoOne.value, NoTwo.value);
    } else if (NoOne.value !== 0 && NoTwo.value !== 0) {
      await randomlyCheckWordsUtil(NoOne.value, NoTwo.value);
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
      if(TASKBAR_POINTER.value === 'UnselectedWords') {
        wordsNotSelected();
        randomlyCheckWords();
      }
      else showWord();
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
      if(TASKBAR_POINTER.value === 'UnselectedWords') {
        wordsNotSelected();
        randomlyCheckWords();
      }
      else showWord();
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
const modifyWordTrue = async (row:any) => {
  await $http.post("http://localhost:8081/word/modifyWordTrue",row).then((res:any) => {
    if(res.data.success === true){
      ElMessage({
        message: res.data.data,
        grouping: true,
        type: 'success',
      })
      if(TASKBAR_POINTER.value === 'UnselectedWords'){
        wordsNotSelected();
        randomlyCheckWords();
      }
      else showWord();
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
const modifyWordError = async (row:any) => {
  await $http.post("http://localhost:8081/word/modifyWordError",row).then((res:any) => {
    if(res.data.success === true){
      ElMessage({
        message: res.data.data,
        grouping: true,
        type: 'success',
      })
      if(TASKBAR_POINTER.value === 'UnselectedWords'){
        wordsNotSelected();
        randomlyCheckWords();
      }
      else showWord();
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
      ResetSlider();
      TASKBAR_POINTER.value = '';
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
* Function description: 利用axios获取后端返回的未抽查过的单词数据并给word数组赋值
* Function return value type: void
* axios:
*   type: get
*   port: http://localhost:8081/word/wordNotChecked/
*   Value passed to backend: NoOne,NoTwo
*   then(res): 获取res中data里的值赋值给tableData
* Whether to call automatically: false
* */
const wordsNotSelected = () => {
  $http.get('http://localhost:8081/word/wordNotChecked/' + NoOne.value + ',' + NoTwo.value).then((res:any) => {
    if(res.data.success === true) {
      tableData.length = 0;
      res.data.data.forEach((i: any) => tableData.push(i));
      TASKBAR_POINTER.value = taskbar[0];
    }else{
      tableData.length = 0;
      TableNoDataValue.value = res.data.errorMsg
    }
    backAllWord.value = true;
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
const showWord = async () => {
  await $http.get("http://localhost:8081/word/showWord").then((res:any) => {
    if (res.data.success === true) {
      tableData.length = 0;
      res.data.data.forEach((i: word) => tableData.push(i));
      loading.value = false;
      maxLength = tableData.length;
    }else{
      console.log(res.data.errorMsg)
    }
  })
}
showWord();

</script>

<style scoped>
.card {
  text-align: center;
  width: 250px;
  height: 344px;
  background: linear-gradient(to right top, #fb4372, #fc4264,#fc4359,#f94851,#f64943,#fc463c);
  border-radius: 15px;
  box-shadow: 1px 5px 60px 0 #100a886b;
}

.card .card-border-top {
  width: 60%;
  height: 3%;
  background: #43cea4;
  margin: auto;
  border-radius: 0px 0px 15px 15px;
}

.card span {
  font-weight: 600;
  color: white;
  text-align: center;
  display: block;
  padding-top: 25px;
  font-size: 21px;
}

.card .job {
  font-weight: 400;
  color: white;
  display: block;
  text-align: center;
  padding-top: 2px;
  font-size: 14px;
}

.card .img {
  width: 100px;
  height: 110px;
  background: #43cea4;
  border-radius: 15px;
  margin-left: auto;
  margin-top: 35px;
}

.card button {
  padding: 8px 25px;
  display: block;
  margin: auto;
  border-radius: 8px;
  border: none;
  margin-top: 20px;
  background: #4bc7e1;
  color: #54625c;
  font-weight: 600;
}

.card button:hover {
  background: #ecf5ff;
}


</style>