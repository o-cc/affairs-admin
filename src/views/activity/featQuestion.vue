<template>
  <el-dialog
    :title="isModify ? '问题详情' : '新增问题'"
    :visible.sync="open"
    :before-close="close"
  >
    <el-form :model="info" class="form">
      <el-form-item label="问题内容" :label-width="formLabelWidth">
        <el-input
          class="input"
          v-model="info.content"
          autocomplete="off"
          placeholder="问题内容"
        ></el-input>
      </el-form-item>
      <el-form-item label="问题类型" :label-width="formLabelWidth">
        <el-select v-model="info.type">
          <el-option
            v-for="item in types"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="info.type === 'write'"
        label="填空标准答案"
        :label-width="formLabelWidth"
      >
        <el-input
          class="input"
          v-model="info.write"
          autocomplete="off"
          placeholder="填空答案"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="info.type === 'choice'"
        label="问题选项"
        :label-width="formLabelWidth"
      >
        <el-row>
          <el-button type="primary" size="mini" @click="innerVisible = true">
            添加选项
          </el-button>
          <span class="prompt">正确答案请勾选</span>
        </el-row>
        <el-checkbox-group v-model="info.standard_choices_indices">
          <div v-for="(item, idx) in info.choices" :key="item">
            <el-checkbox :label="idx">{{ item }}</el-checkbox>
            <i class="el-icon-delete remove" @click="removeOption(item)">
              删除
            </i>
          </div>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="问题可获得积分" :label-width="formLabelWidth">
        <el-input
          class="input"
          v-model="info.integral"
          autocomplete="off"
          placeholder="积分"
          type="number"
        ></el-input>
      </el-form-item>
    </el-form>

    <el-dialog
      width="30%"
      title="请输入选项内容"
      :visible.sync="innerVisible"
      append-to-body
    >
      <el-input
        v-model="currOption"
        autocomplete="off"
        placeholder="请输入选项内容"
      ></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = false">取 消</el-button>
        <el-button type="primary" @click="featOption">
          确定
        </el-button>
      </div>
    </el-dialog>

    <div slot="footer" class="dialog-footer">
      <el-button @click.native="close">取 消</el-button>
      <el-button type="primary" @click.native="feat">
        {{ isModify ? '修改' : '添加' }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { postActivities, postQuestion, putQuestion } from '@/api';
import { Message } from 'element-ui';
export default {
  props: {
    isModify: {
      type: Boolean,
      default: false
    },
    open: {
      type: Boolean,
      default: true
    },
    actId: {
      type: Number
    },
    form: {
      type: Object,
      default() {
        return {
          content: '',
          type: '',
          integral: undefined,
          write: '',
          standard_choices_indices: [],
          choices: ['选项A']
        };
      }
    }
  },
  data() {
    return {
      currOption: '',
      innerVisible: false,
      formLabelWidth: '120px',
      info: {
        content: '',
        type: '',
        integral: undefined,
        write: '',
        standard_choices_indices: [],
        choices: []
      },
      types: [
        { label: '选择题类型', value: 'choice' },
        { label: '填空题类型', value: 'write' }
      ]
    };
  },
  mounted() {
    this.info = JSON.parse(JSON.stringify(this.form));
  },
  methods: {
    featOption() {
      if (this.currOption) {
        this.info = {
          ...this.info,
          choices: this.info.choices.concat(this.currOption)
        };
        this.currOption = '';
      }
      this.innerVisible = false;
    },
    removeOption(k) {
      this.$confirm('确定移除该选项吗？').then(() => {
        this.info = {
          ...this.info,
          choices: this.info.choices.filter(i => i !== k)
        };
      });
    },
    close() {
      this.$emit('onClose');
    },
    feat() {
      let error = '';
      let data = { ...this.info };
      if (!data.content) {
        error = '请输入问题内容';
      } else if (!data.type) {
        error = '请选择问题类型';
      }

      if (data.type === 'choice') {
        if (data.standard_choices_indices.length < 1) {
          error = '请勾选设置正确答案';
        } else {
          delete data.write;
        }
      } else if (data.type === 'write') {
        if (!data.write) {
          error = '请填写正确答案';
        } else {
          delete data.standard_choices_indices;
          delete data.choices;
        }
      }

      if (error) {
        return Message({
          message: error,
          type: 'error',
          duration: 5 * 1000
        });
      }
      console.log(data);
      if (this.isModify) {
        putQuestion(this.actId, data)
          .then(() => {
            Message({
              message: '修改成功',
              type: 'success'
            });
            this.$emit('fetchData');
          })
          .catch(e => {});
        return;
      }
      postQuestion(this.actId, data)
        .then(() => {
          Message({
            message: '添加成功',
            type: 'success'
          });
          this.$emit('fetchData');
        })
        .catch(e => {});
    }
  }
};
</script>

<style scoped>
.input {
  width: 350px;
}

.remove {
  font-size: 14px;
  color: #999;
  user-select: none;
  margin-left: 30px;
  cursor: pointer;
}
.remove:hover {
  color: red;
}

.prompt {
  color: #aaa;
  font-size: 14px;
  margin-left: 15px;
}
</style>
